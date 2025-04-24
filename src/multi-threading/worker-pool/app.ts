import { performance } from "perf_hooks";
import { calculateFactorial } from "./factorial";
import { generatePrimes } from "./generate-prime";
import { WorkerPool } from "./pool";

const pool = new WorkerPool(4);
const TOTAL_TASKS = 2_000_000;
let tasksDone = 0;

const start = performance.now();

for (let i = 0; i < TOTAL_TASKS; i++) {
  if (i % 5 === 0) {
    pool.submitTask({
      taskFn: generatePrimes,
      args: [1_000_000, 20],
      cb: (result) => {
        ++tasksDone;
        if (tasksDone === TOTAL_TASKS) {
          console.log("Completed! Time taken: ", performance.now() - start);
          process.exit(0);
        }
      },
    });
  } else {
    pool.submitTask({
      taskFn: calculateFactorial,
      args: [50],
      cb: (result) => {
        ++tasksDone;
        if (tasksDone === TOTAL_TASKS) {
          console.log("Completed! Time taken: ", performance.now() - start);
          process.exit(0);
        }
      },
    });
  }
}

/*
### PROBLEM ###
1. when high total_tasks value
  main thread will get blocked as the loop will register callbacks and tasks to the queue - increased memory
  and the GC will try to clear as much as it can, there will be no room for worker threads apart from the first
  n to execute, at some point the program will crash due to exceeded heap size limit
*/

setInterval(() => {
  console.clear();
  console.log(performance.eventLoopUtilization());
}, 1000);
