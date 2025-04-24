process.env.UV_THREADPOOL_SIZE = "6"; // default value is 4

import { join } from "path";
import { Worker } from "worker_threads";

console.log("Thread Pool Thread Count:", process.env.UV_THREADPOOL_SIZE);

const THREADS = 1;
let completed = 0;
const count = 100_000;

for (let i = 0; i < THREADS; i++) {
  const start = performance.now();

  const worker = new Worker(join(__dirname, "./calc-async.js"), {
    workerData: { count: count / THREADS },
  });

  const threadId = worker.threadId;
  console.log(`Worker ${threadId} started.`);

  worker.on("message", (msg) => {});

  worker.on("error", (err) => {
    console.error(err);
  });

  worker.on("exit", (code) => {
    console.log(`Worker ${threadId} exited.`);

    completed++;

    if (completed === THREADS) {
      console.log(`Time taken: ${performance.now() - start}ms`);
    }

    if (code !== 0) {
      console.error(new Error(`Worker exited with code ${code}`));
    }
  });
}
