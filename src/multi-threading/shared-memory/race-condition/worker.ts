import { workerData } from "worker_threads";

const number = new Uint32Array(workerData.number);

for (let i = 0; i < 50000; i++) {
  // atomic operation - race condition does not happen
  Atomics.add(number, 0, 1);

  // race condition occurs
  // number[0] += 1;
}
