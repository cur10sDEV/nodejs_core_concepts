import { existsSync, WriteStream } from "fs";
import fs, { FileHandle } from "fs/promises";
import { createServer } from "net";
import path from "path";

const server = createServer();

server.on("connection", (socket) => {
  console.log(`Client connected!!!`);

  let uploadFileHandle: FileHandle;
  let uploadFileStream: WriteStream;

  socket.on("data", async (data) => {
    // UPLOAD
    if (!uploadFileHandle || !uploadFileStream) {
      // pause stream of data until successfull file open operation
      socket.pause();

      // grabbing the file path
      const indexOfDivider = data.indexOf("---FileName");
      const fileName = data.subarray(0, indexOfDivider).toString("utf-8");
      const filePath = path.join(__dirname, "storage", fileName);

      // create write stream
      uploadFileHandle = await fs.open(filePath, "w");
      uploadFileStream = uploadFileHandle.createWriteStream();

      // registering event listeners on uploadFileStream
      uploadFileStream.on("drain", () => {
        socket.resume();
      });

      socket.resume();
    }

    if (!uploadFileStream.write(data)) {
      socket.pause();
    }
  });

  socket.on("end", async () => {
    uploadFileStream?.close();
    await uploadFileHandle?.close();
  });

  socket.on("close", () => {
    console.log(`Client disconnected!!!`);
  });
});

server.on("close", () => {
  console.log(`Server closed!!!`);
});

server.listen(3000, "::1", () => {
  const storageDir = path.join(__dirname, "storage");
  if (!existsSync(storageDir)) {
    fs.mkdir(storageDir).then(() => {
      console.log(`Server started on:`, server.address());
    });
  } else {
    console.log(`Server started on:`, server.address());
  }
});
