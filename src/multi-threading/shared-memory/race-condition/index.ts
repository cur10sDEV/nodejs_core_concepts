import { Buffer } from "buffer";
import path from "path";
import { Worker } from "worker_threads";

const number = Buffer.from(new SharedArrayBuffer(4)); // 32-bit number

const THREADS = 6;
let completed = 0;

for (let i = 0; i < THREADS; i++) {
  const worker = new Worker(path.join(__dirname, "./worker.js"), {
    workerData: { number: number.buffer }, // data will be shared, data2 will be cloned
  });

  worker.on("exit", (code) => {
    ++completed;
    if (completed === THREADS) {
      console.log(`Final number is: `, number.readUInt32LE());
      // the output should be 6 * 50000 = 300000 but it isn't
      // classic case of race-condition
    }
  });
}
