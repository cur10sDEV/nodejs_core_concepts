import path from "path";
import { MessageChannel, Worker } from "worker_threads";

const { port1, port2 } = new MessageChannel();

// because
const thread1 = new Worker(path.join(__dirname, "./worker.js"), {
  workerData: { port: port1 },
  transferList: [port1],
});

const thread2 = new Worker(path.join(__dirname, "./worker.js"), {
  workerData: { port: port2 },
  transferList: [port2],
});

thread1.postMessage(`Message from Parent to thread ${thread1.threadId}`);
thread1.postMessage(`Message from Parent to thread ${thread2.threadId}`);

/*
// You can also use transferList in postMessage method
thread1.postMessage("some message...", [port]);
*/
