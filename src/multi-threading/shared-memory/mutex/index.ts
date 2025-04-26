import { Buffer } from "buffer";
import path from "path";
import { Worker } from "worker_threads";

const number = Buffer.from(new SharedArrayBuffer(4)); // 32-bit number
const lock = new SharedArrayBuffer(4); // 32-bit number

const THREADS = 6;
let completed = 0;

for (let i = 0; i < THREADS; i++) {
  const worker = new Worker(path.join(__dirname, "./worker.js"), {
    workerData: { number: number.buffer, lock }, // data will be shared
  });

  worker.on("exit", (code) => {
    ++completed;
    if (completed === THREADS) {
      console.log(`Final number is: `, number.readUInt32LE());
    }
  });
}
