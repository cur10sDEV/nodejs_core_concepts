import { existsSync } from "fs";
import fs from "fs/promises";
import { createConnection } from "net";
import path from "path";

const socket = createConnection({ port: 3000, host: "::1" });

socket.on("connect", async () => {
  console.log(`Connected to server!!!`);

  await uploadFile();
});

socket.on("error", () => {
  console.log(`Socket Error!!!`);
});

// for formatting of upload progress
console.log();

async function uploadFile() {
  const filePath = process.argv[2];

  // if file does not exist
  if (!existsSync(filePath)) {
    throw new Error("File does not exist!!!");
  }

  const fileName = path.basename(filePath);

  const uploadFileHandle = await fs.open(filePath, "r");
  const readStream = uploadFileHandle.createReadStream();

  // grabbing stats for showing upload progress
  const totalFileSize = (await uploadFileHandle.stat()).size;
  let bytesUploaded = 0;
  let uploadPercent = 0;

  socket.write(`${fileName}---FileName`);

  readStream.on("data", (data) => {
    // handling backpressure
    if (!socket.write(data)) {
      readStream.pause();
    } else {
      bytesUploaded += data.length;
      const newUploadPercent = Math.floor(
        (bytesUploaded / totalFileSize) * 100
      );
      if (newUploadPercent !== uploadPercent) {
        uploadPercent = newUploadPercent;
        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine(0);
        console.log(`Uploading... ${uploadPercent}%`);
      }
    }
  });

  // handling backpressure
  socket.on("drain", () => {
    readStream.resume();
  });

  readStream.on("end", () => {
    console.log("Upload Successfull!!!");
    socket.end();
  });
}
