import { randomUUID } from "node:crypto";
import path from "node:path";
import { CustomWorker, type Task } from "./custom-worker";

export class WorkerPool {
  private poolSize = 4;
  private workers: CustomWorker[];
  private availableWorkers: CustomWorker[];
  private tasks: SavedTask[];

  constructor(poolSize = 4) {
    this.poolSize = Math.min(128, Math.max(1, poolSize));
    this.workers = [];
    this.availableWorkers = [];
    this.tasks = [];

    this._spawnThreads();
  }

  private _spawnThreads() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new CustomWorker(
        path.join(__dirname, "./worker-handler.js")
      );

      worker.on("message", async (message) => {
        // invoke the registered callback
        // const cb = new Function(`return ` + worker.currentTask?.cb)(); // deserialization
        // await cb(message);
        await worker.currentTask?.cb(message);

        // reset worker's currentTask
        worker.currentTask = null;

        // make the worker available for further tasks
        this.availableWorkers.push(worker);

        // process next task
        this._processNextTask();
      });

      worker.on("error", (error) => {
        console.error(
          `Worker error during task ${worker.currentTask?.taskId}: `,
          error
        );
      });

      // register workers upon spawning
      this.availableWorkers.push(worker);
      this.workers.push(worker);
    }
  }

  submitTask(task: Omit<Task, "taskId">) {
    const taskId = randomUUID();

    // serialization
    const taskFn = task.taskFn.toString();
    // const cb = task.cb.toString();

    // push tasks onto the queue
    // this.tasks.push({ ...task, taskFn, cb, taskId });
    this.tasks.push({ ...task, taskFn, taskId });

    // process the next task - if this is the only task in the queue
    this._processNextTask();
  }

  private _processNextTask() {
    // if there is atleast one task in the queue & any worker is free to process that task
    if (this.tasks.length > 0 && this.availableWorkers.length > 0) {
      const { taskFn, taskId, args, cb } = this.tasks.shift()!;
      const worker = this.availableWorkers.shift()!;

      // offload the task to the worker
      worker.currentTask = { taskFn, taskId, args, cb };
      worker.postMessage({ taskFn, taskId, args });
    }
  }

  async shutdown() {
    const terminationPromises = this.workers.map((worker) => {
      return new Promise((resolve) => {
        worker.on("exit", resolve);
        worker.terminate();
      });
    });

    await Promise.all(terminationPromises);

    this.workers = [];
    this.availableWorkers = [];
    this.tasks = [];
  }
}

/* Types */
export type SavedTask = {
  taskFn: string; // deep cloning of fn
  // cb: string;
  cb: (...args: any) => any;
  taskId: string;
  args: any;
};
