import { workerData } from "worker_threads";

const number = new Uint32Array(workerData.number);
const lock = new Int32Array(workerData.lock);

for (let i = 0; i < 50000; i++) {
  lockResource();

  // critical section
  number[0] = number[0] + 1;

  unlockResource();
}

function lockResource() {
  // check if resource is available, if so lock it and if not wait
  while (Atomics.compareExchange(lock, 0, 0, 1) === 1) {
    Atomics.wait(lock, 0, 1);
  }
}

function unlockResource() {
  // unlock the resource
  Atomics.store(lock, 0, 0);
  Atomics.notify(lock, 0, 1);
}
