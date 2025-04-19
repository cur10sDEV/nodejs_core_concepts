const DB = require("../src/DB");
const util = require("./uitl");
const FF = require("./ff");

class JobQueue {
  constructor() {
    this.jobs = [];
    this.currentJob = null;

    // check for pending jobs in the database and enqueue all of them
    DB.update();
    DB.videos.forEach((video) => {
      for (const [key, value] of Object.entries(video.resizes)) {
        if (value.processing === true) {
          const [width, height] = key.split("x");
          this.enqueue({
            type: "resize",
            videoId: video.videoId,
            width,
            height,
          });
        }
      }
    });
  }

  enqueue(job) {
    this.jobs.push(job);
    this.#executeNext();
  }

  #dequeue() {
    return this.jobs.shift();
  }

  #executeNext() {
    if (this.currentJob) return;
    this.currentJob = this.#dequeue();
    if (!this.currentJob) return;
    this.#execute(this.currentJob);
  }

  async #execute(job) {
    if (job.type === "resize") {
      const { videoId, width, height } = job;
      // get the video to be processed
      DB.update();
      const video = DB.videos.find((v) => v.videoId === videoId);

      const originalVideoPath = `./storage/${video.videoId}/original.${video.extension}`;
      const targetVideoPath = `./storage/${video.videoId}/${width}x${height}.${video.extension}`;

      try {
        // resize
        await FF.resize(originalVideoPath, targetVideoPath, width, height);

        // get the latest changes and update the db once resize finishes
        DB.update();
        const video = DB.videos.find((v) => v.videoId === videoId);
        video.resizes[`${width}x${height}`].processing = false;
        DB.save();

        console.log("Done resizing! No of jobs remaining", this.jobs.length);
      } catch (error) {
        util.deleteFile(targetVideoPath);
      }
    }
    this.currentJob = null;
    this.#executeNext();
  }
}

module.exports = JobQueue;
