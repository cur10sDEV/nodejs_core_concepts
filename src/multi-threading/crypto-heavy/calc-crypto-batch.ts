import { randomFillSync } from "crypto";
import { parentPort, workerData } from "worker_threads";

const BATCH_SIZE = 50096; // number of bytes to generate in each batch
const buffer = Buffer.alloc(BATCH_SIZE);

function fillBuffer() {
  randomFillSync(buffer);
}

function readRandomNumber(offset: number) {
  const randomNumber = buffer.readUInt16BE(offset);
  return randomNumber;
}

let sum = 0;
let random;
let bufferOffset = 0;

fillBuffer();

for (let i = 0; i < workerData.count; i++) {
  if (bufferOffset >= BATCH_SIZE) {
    fillBuffer();
    bufferOffset = 0;
  }

  random = readRandomNumber(bufferOffset);
  bufferOffset += 2; // move to the next 16 bit segment
  sum += random;

  if (sum > 100_000_000) {
    sum = 0;
  }
}

parentPort?.postMessage(sum);
