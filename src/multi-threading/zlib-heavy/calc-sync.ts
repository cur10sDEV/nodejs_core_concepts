import { readFileSync } from "fs";
import { parentPort, workerData } from "worker_threads";
import { deflateSync } from "zlib";

const data = readFileSync("./text.txt");

function compressSync() {
  try {
    deflateSync(data);
    return "done";
  } catch (err) {
    console.error("An error occurred:", err);
    throw err;
  }
}

const totalIterations = workerData.count; // total number of times to compress

for (let i = 0; i < totalIterations; i++) {
  try {
    compressSync();
  } catch (err) {
    console.error("Error compressing:", err);
  }
}

parentPort?.postMessage("done");
