const { mkdir, open } = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { pipeline } = require("node:stream/promises");
const util = require("../../lib/uitl");
const FF = require("../../lib/ff");
const DB = require("../DB");
const JobQueue = require("../../lib/job-queue");

const jobs = new JobQueue();

// return the list of all videos uploaded by the logged in user
const getVideos = (req, res, handleError) => {
  DB.update();
  const videos = DB.videos.filter((video) => video.userId === req.userId);

  res.status(200).json(videos);
};

// upload a video
const uploadVideo = async (req, res, handleError) => {
  const specifiedFileName = req.headers.filename;
  const extension = path.extname(specifiedFileName).substring(1).toLowerCase();
  const name = path.parse(specifiedFileName).name;
  const videoId = crypto.randomBytes(4).toString("hex");
  const folderPath = `./storage/${videoId}`;

  const FORMATS_SUPPORTED = ["mov", "mp4"];

  if (FORMATS_SUPPORTED.indexOf(extension) === -1) {
    return handleError({
      status: 400,
      message: "Only these formats are supported: mov, mp4",
    });
  }

  try {
    await mkdir(folderPath);
    const fullPath = `${folderPath}/original.${extension}`;
    const fileHandle = await open(fullPath, "w");
    const fileStream = fileHandle.createWriteStream();
    const thumbnailPath = `./storage/${videoId}/thumbnail.jpg`;

    // write/upload file
    await pipeline(req, fileStream);

    // make thumbnail
    await FF.makeThumbnail(fullPath, thumbnailPath);

    // get dimensions
    const dimensions = await FF.getDimensions(fullPath);

    // update db
    DB.update();
    DB.videos.unshift({
      id: DB.videos.length,
      videoId,
      name,
      extension,
      dimensions,
      userId: req.userId,
      extractedAudio: false,
      resizes: {},
    });
    DB.save();

    res.status(201).json({
      status: "success",
      message: "The file was uploaded successfully",
    });
  } catch (error) {
    // delete the folder, created during uploading
    util.deleteFolder(folderPath);
    if (error.code !== "ECONNRESET") return handleError(error);
  }
};

// return video assets like thumbnail
const getVideoAsset = async (req, res, handleError) => {
  try {
    const videoId = req.params.get("videoId");
    const type = req.params.get("type");

    DB.update();
    const video = DB.videos.find((video) => video.videoId === videoId);

    if (!video) {
      return handleError({
        status: 404,
        message: "Video not found!",
      });
    }

    let file;
    let mimeType;
    let fileName; // the final file name for the download

    switch (type) {
      case "thumbnail":
        file = await open(`./storage/${videoId}/thumbnail.jpg`, "r");
        mimeType = "image/jpeg";
        break;

      case "original":
        file = await open(
          `./storage/${videoId}/original.${video.extension}`,
          "r"
        );
        mimeType = `video/${video.extension}`; // this is not correct you should derive mime types from extension
        fileName = `${video.name}.${video.extension}`;
        break;

      case "audio":
        file = await open(`./storage/${videoId}/audio.aac`, "r");
        mimeType = "audio/aac";
        fileName = `${video.name}-audio.aac`;
        break;

      case "resize":
        const dimensions = req.params.get("dimensions");
        file = await open(
          `./storage/${videoId}/${dimensions}.${video.extension}`,
          "r"
        );
        mimeType = `video/${video.extension}`;
        fileName = `${video.name}-${dimensions}.${video.extension}`;
        break;
    }

    // grab the file size
    const stat = await file.stat();

    const fileStream = file.createReadStream();
    if (type !== "thumbnail") {
      // this is how the downloaded file gets the correct name
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    }

    // set response headers
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Length", stat.size);

    res.status(200);

    await pipeline(fileStream, res);

    await file.close();
  } catch (error) {
    console.error(error);
  }
};

// extract the audio off a video file
const extractAudio = async (req, res, handleError) => {
  const videoId = req.params.get("videoId");

  DB.update();
  const video = DB.videos.find((video) => video.videoId === videoId);

  if (!video) {
    return handleError({
      status: 404,
      message: "Video not found!",
    });
  }

  if (video.extractedAudio) {
    return handleError({
      status: 400,
      message: "The audio has already been extracted from this video!",
    });
  }

  const videoPath = `./storage/${videoId}/original.${video.extension}`;
  const audioPath = `./storage/${videoId}/audio.aac`;
  try {
    // extract audio
    await FF.extractAudio(videoPath, audioPath);

    // update db
    video.extractedAudio = true;
    DB.save();

    res.status(201).json({
      status: "success",
      message: "The audio was extracted successfully!",
    });
  } catch (error) {
    util.deleteFile(audioPath);
    return handleError(error);
  }
};

// resize a video to provided dimensions
const resizeVideo = async (req, res, handleError) => {
  const videoId = req.body.videoId;
  const width = parseInt(req.body.width);
  const height = parseInt(req.body.height);

  DB.update();
  const video = DB.videos.find((v) => v.videoId === videoId);
  video.resizes[`${width}x${height}`] = { processing: true };
  DB.save();

  try {
    // put the job on the queue
    jobs.enqueue({
      type: "resize",
      videoId,
      width,
      height,
    });

    res.status(200).json({
      status: "success",
      message: "The video is now being processed!",
    });
  } catch (error) {
    return handleError(error);
  }
};

const controller = {
  getVideos,
  uploadVideo,
  extractAudio,
  getVideoAsset,
  resizeVideo,
};

module.exports = controller;
