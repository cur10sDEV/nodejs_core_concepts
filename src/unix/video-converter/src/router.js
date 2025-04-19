// Controllers
const User = require("./controllers/user");
const Video = require("./controllers/video");

module.exports = (server) => {
  // ------------------------------------------------ //
  // ************ USER ROUTES ************* //
  // ------------------------------------------------ //

  // Log a user in and give them a token
  server.post("/api/login", User.logUserIn);

  // Log a user out
  server.delete("/api/logout", User.logUserOut);

  // Send user info
  server.get("/api/user", User.sendUserInfo);

  // Update a user info
  server.put("/api/user", User.updateUser);

  // ------------------------------------------------ //
  // ************ VIDEO ROUTES ************* //
  // ------------------------------------------------ //

  // Get videos
  server.get("/api/videos", Video.getVideos);

  // upload video
  server.post("/api/upload-video", Video.uploadVideo);

  // extract audio from a video file
  server.patch("/api/video/extract-audio", Video.extractAudio);

  // resize a video
  server.put("/api/video/resize", Video.resizeVideo);

  // get video assets like thumbnail
  server.get("/get-video-asset", Video.getVideoAsset);
};
