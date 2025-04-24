import { Worker } from "node:worker_threads";
import { type SavedTask } from "./pool";

export class CustomWorker extends Worker {
  private _currentTask: SavedTask | null;

  constructor(filename: string | URL, options?: WorkerOptions) {
    super(filename, options);
    this._currentTask = null;
  }

  set currentTask(task: SavedTask | null) {
    this._currentTask = task;
  }

  get currentTask() {
    return this._currentTask;
  }
}

/* Types */
export type Task = {
  taskId: string;
  taskFn: (...args: any[]) => any;
  args: any[];
  cb: (result: any) => void;
};
