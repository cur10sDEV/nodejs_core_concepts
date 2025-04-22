import { parentPort, threadId, workerData } from "worker_threads";
const port = workerData.port;

port.postMessage(`Message from thread: ${threadId} to another thread`);

port.on("message", (message: any) => {
  console.log(message);
});

parentPort?.on("message", (message) => {
  console.log(`Parent: ${message}`);
});

setTimeout(() => {
  process.exit(0);
}, 1000);
