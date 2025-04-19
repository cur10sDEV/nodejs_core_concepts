const { spawn } = require("node:child_process");

const makeThumbnail = (videoFilePath, thumbnailPath) => {
  // ffmpeg -i video.mp4 -ss 5 -vframes 1 thumbnail.jpg
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      videoFilePath,
      "-ss",
      "5",
      "-vframes",
      "1",
      thumbnailPath,
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(`ffmpeg exited with code: ${code}`);
    });

    ffmpeg.on("error", (err) => {
      reject(err);
    });
  });
};

const getDimensions = (videoFilePath) => {
  // ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 video.mp4
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height",
      "-of",
      "csv=p=0",
      videoFilePath,
    ]);

    let dimensions = "";
    ffprobe.stdout.on("data", (chunk) => {
      dimensions += chunk.toString("utf-8");
    });

    ffprobe.on("close", (code) => {
      if (code === 0) {
        dimensions = dimensions.replace(/\s/g, "").split(",");
        resolve({
          width: dimensions[0],
          height: dimensions[1],
        });
      } else reject(`ffprobe exited with code: ${code}`);
    });

    ffprobe.on("error", (err) => {
      reject(err);
    });
  });
};

const extractAudio = (originalVideoPath, targetAudioPath) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      originalVideoPath,
      "-vn",
      "-c:a",
      "copy",
      targetAudioPath,
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`ffmpeg exited with code: ${code}`);
      }
    });

    ffmpeg.on("error", (err) => {
      reject(err);
    });
  });
};

const resize = (originalVideoPath, targetVideoPath, width, height) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      originalVideoPath,
      "-vf",
      `scale=${width}:${height}`,
      "-c:a",
      "copy",
      "-threads",
      "2", // only 2 cores allowed (does not respect this everytime)
      "-y", // yes to all prompts
      targetVideoPath,
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`ffmpeg exited with code: ${code}`);
      }
    });

    ffmpeg.on("error", (err) => {
      reject(err);
    });
  });
};

module.exports = {
  makeThumbnail,
  getDimensions,
  extractAudio,
  resize,
};
