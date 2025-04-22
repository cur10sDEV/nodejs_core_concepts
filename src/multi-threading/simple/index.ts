import path from "path";
import { Worker } from "worker_threads";

// hardcoded thread
const thread1 = new Worker(path.join(__dirname, "thread.js"), {
  workerData: {
    // this creates a copy and then pass it to worker thread
    number: 10_000_000_000,
  },
});

addListenersToThread(thread1);

// varying no. of threads of worker threads using loops
for (let i = 0; i < 2; i++) {
  const worker = new Worker(path.join(__dirname, "thread.js"), {
    workerData: {
      number: 10_000_000_000,
      autoExit: true,
    },
  });
  addListenersToThread(worker, true);
}

console.log("Main thread completed!");

// util function
function addListenersToThread(thread: Worker, autoExit?: boolean) {
  const threadId = thread.threadId;

  thread.on("online", () => {
    console.log(`thread: ${threadId} started!`);
  });

  thread.on("message", (message) => {
    console.log(`Iterations Completed:`, message);
    thread.postMessage({ finished: true });
  });

  thread.on("error", (err) => {
    console.log(`Worker thread error`, err);
  });

  thread.on("exit", (code) => {
    console.error(`thread: ${threadId} exited with code: ${code}`);
  });
}
