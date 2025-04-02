import fs from "fs";
import { Readable } from "stream";

class FileReadStream extends Readable {
  private fileName: string;
  private fd: number | null;

  constructor({
    highWaterMark,
    fileName,
  }: {
    highWaterMark?: number;
    fileName: string;
  }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
  }

  _construct(callback: (error?: Error | null) => void): void {
    fs.open(this.fileName, "r", (err, fd) => {
      if (err) return callback(err);

      this.fd = fd;
      callback();
    });
  }

  _read(size: number): void {
    const buff = Buffer.alloc(size);

    if (this.fd) {
      // @ts-ignore
      fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
        if (err) return this.destroy(err);

        // handling zeroes(nulls) at last - i.e., empty/partly-empty buffer
        // null is to indicate the end of stream
        this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
      });
    }
  }

  _destroy(
    error: Error | null,
    callback: (error?: Error | null) => void
  ): void {
    if (this.fd) {
      fs.close(this.fd, (err) => callback(err || error));
    } else {
      callback(error);
    }
  }
}

const readStream = new FileReadStream({ fileName: "sample.txt" });

readStream.on("data", (chunk) => {
  console.log(chunk.toString());
});

readStream.on("end", () => {
  console.log(`File reading done`);
});
