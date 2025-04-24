import { performance } from "perf_hooks";
import { calculateFactorial } from "./factorial";
import { generatePrimes } from "./generate-prime";
import { WorkerPool } from "./pool";

const pool = new WorkerPool(4);
const TOTAL_TASKS = 20_000_000;
let tasksDone = 0;

const batchSize = 1_000;
let batchIndex = 0;

const start = performance.now();

function submitBatch(startIndex: number, endIndex: number) {
  let batchTaskCount = 0;
  for (let i = startIndex; i < endIndex; i++) {
    if (i % 5 === 0) {
      // increase as we have new task to process in the batch
      batchTaskCount++;
      pool.submitTask({
        taskFn: calculateFactorial,
        args: [50],
        cb: (result) => {
          ++tasksDone;

          // decrement as one of the task is completed
          batchTaskCount--;

          // if all tasks are completed
          if (tasksDone === TOTAL_TASKS) {
            console.log("Completed! Time taken: ", performance.now() - start);
            process.exit(0);
          }

          // if the batch tasks are completed move forward to another batch
          if (batchTaskCount === 0) {
            batchIndex++;
            submitNextBatch();
          }
        },
      });
    } else {
      // increase as we have new task to process in the batch
      batchTaskCount++;
      pool.submitTask({
        taskFn: generatePrimes,
        args: [1_000_000 + i * 500, 20],
        cb: (result) => {
          ++tasksDone;

          // decrement as one of the task is completed
          batchTaskCount--;

          // if all tasks are completed
          if (tasksDone === TOTAL_TASKS) {
            console.log("Completed! Time taken: ", performance.now() - start);
            process.exit(0);
          }

          // if the batch tasks are completed move forward to another batch
          if (batchTaskCount === 0) {
            batchIndex++;
            submitNextBatch();
          }
        },
      });
    }
  }
}

function submitNextBatch() {
  if (batchIndex * batchSize < TOTAL_TASKS) {
    const startIndex = batchIndex * batchSize;
    const endIndex = Math.min((batchIndex + 1) * batchSize, TOTAL_TASKS);
    submitBatch(startIndex, endIndex);
  }
}

// start the first batch
submitNextBatch();

setInterval(() => {
  console.clear();
  console.log(performance.eventLoopUtilization());
}, 1000);
