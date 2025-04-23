import path from "path";
import { Worker } from "worker_threads";

const THREADS = 6;
let completed = 0;
let sum = 0;
const count = 10_000_000_000;
const workerFileName = path.join(__dirname, "calc-crypto-batch.js");

console.log(`Running with ${path.basename(workerFileName)}...`);

for (let i = 0; i < THREADS; i++) {
  const start = performance.now();

  const worker = new Worker(workerFileName, {
    workerData: { count: count / THREADS },
  });

  const threadId = worker.threadId;
  console.log(`Worker ${threadId} started`);

  worker.on("message", (number) => {
    sum += number;
  });

  worker.on("error", (err) => {
    console.error(err);
  });

  worker.on("exit", (code) => {
    console.log(`Worker ${threadId} exited.`);

    completed++;

    if (completed === THREADS) {
      console.log(`Time taken: ${performance.now() - start}ms`);
      console.log(`Sum: ${sum}`);
    }

    if (code !== 0) {
      console.error(new Error(`Worker exited with code ${code}`));
    }
  });
}
