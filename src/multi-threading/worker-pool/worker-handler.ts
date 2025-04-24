import { parentPort } from "node:worker_threads";

parentPort?.on("message", async (message: IncomingMessage) => {
  const { taskFn, args } = message;
  const taskToExecute = new Function(`return ` + taskFn)();

  if (typeof taskToExecute === "function") {
    const result = await taskToExecute(...args);

    // send the result back
    parentPort?.postMessage(result);
  }
});

type IncomingMessage = {
  taskId: string;
  taskFn: string;
  args: any[];
  cb: (result: any) => void;
};
