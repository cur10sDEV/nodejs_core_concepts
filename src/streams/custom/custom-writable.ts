import fs from "fs";
import { Writable } from "stream";

class FileWriteStream extends Writable {
  private fileName: string;
  private fd: number | null; // file descriptor
  private chunks: any[];
  private chunksSize: number;
  private writeCount: number;

  constructor({
    highWaterMark,
    fileName,
  }: {
    highWaterMark?: number | undefined;
    fileName: string;
  }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunksSize = 0;
    this.writeCount = 0;
  }

  // this will run after the constructor, halting all other methods invocation until callback is called
  _construct(callback: (error?: Error | null) => void): void {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        return callback(err);
      }
      this.fd = fd;
      // no arguments passed means no error
      callback();
    });
  }

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    // if chunks is full then write - handling backpressure
    if (this.chunksSize > this.writableHighWaterMark) {
      if (this.fd) {
        fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
          if (err) return callback(err);

          this.chunks = [];
          this.chunksSize = 0;
          ++this.writeCount;
          callback();
        });
      }
    } else {
      callback();
    }
  }

  _final(callback: (error?: Error | null) => void): void {
    if (this.fd) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) return callback(err);

        this.chunks = [];
        ++this.writeCount;
        callback();
      });
    }
  }

  _destroy(
    error: Error | null,
    callback: (error?: Error | null) => void
  ): void {
    if (this.fd) {
      fs.close(this.fd, (err) => {
        console.log(`WriteCount: ${this.writeCount}`);
        callback(err || error);
      });
    } else {
      callback(error);
    }
  }
}

/* Example */
(async () => {
  const writeCount = 1_000_000;
  console.time("writeMany");

  const stream = new FileWriteStream({ fileName: "sample.txt" });

  let i = 1;
  let drainCount = 0;

  function writeMany() {
    while (i <= writeCount) {
      if (stream.writableLength >= stream.writableHighWaterMark) {
        break;
      }

      const buff = Buffer.from(`${i}\n`, "utf-8");

      if (i === writeCount) {
        return stream.end(buff);
      }

      stream.write(buff);
      i++;
    }
  }

  writeMany();

  stream.on("drain", () => {
    drainCount++;
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("writeMany");
    console.log({ drainCount });
  });
})();
