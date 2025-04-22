import { parentPort, workerData } from "worker_threads";

const number = workerData.number;
const autoExit = workerData.autoExit;

for (let i = 1; i <= number; i++) {}

parentPort?.postMessage({ iterations: number });

parentPort?.on("message", (message) => {
  console.log(`Received Message from Parent`, message);
  if (message.finished) {
    parentPort?.close();
  }
});

// if (autoExit) {
//   process.exit(0);
// }
