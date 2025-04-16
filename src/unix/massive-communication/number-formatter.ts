import { createWriteStream } from "fs";

const destinationFilePath = process.argv[2];
const separator = process.argv[3];
const symbolToPrepend = process.argv[4];

console.log({ destinationFilePath, separator, symbolToPrepend });
const writeStream = createWriteStream(destinationFilePath);

process.stdin.on("data", (data) => {
  const dataToProcess = data.toString("utf-8").split(separator);
  dataToProcess.forEach((d) => {
    if (d.length > 0) {
      if (!writeStream.write(`${symbolToPrepend}${d}${separator}`)) {
        process.stdin.pause();
      }
    }
  });
});

writeStream.on("drain", () => {
  process.stdin.resume();
});
