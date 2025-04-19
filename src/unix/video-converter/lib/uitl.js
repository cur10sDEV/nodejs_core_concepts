const { rm, unlink } = require("node:fs/promises");

const deleteFolder = async (path) => {
  try {
    await rm(path, { recursive: true });
  } catch (error) {
    // do nothing
  }
};

const deleteFile = async (path) => {
  try {
    await unlink(path);
  } catch (error) {
    // do nothing
  }
};

const util = { deleteFolder, deleteFile };

module.exports = util;
