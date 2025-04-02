import { open } from "fs/promises";
import { Transform, TransformCallback } from "stream";

class Encryption extends Transform {
  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] !== 255) {
        chunk[i] += 1;
      }
    }
    callback(null, chunk);
  }
}

(async () => {
  const readFileHandle = await open("data.txt", "r");
  const writeFileHandle = await open("encrypted.txt", "w");

  const encryption = new Encryption();

  const readStream = readFileHandle.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();

  readStream.pipe(encryption).pipe(writeStream);
})();
