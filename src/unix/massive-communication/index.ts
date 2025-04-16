import { spawn } from "child_process";
import { createReadStream } from "fs";
import path from "path";

const sourceFilePath = process.argv[2];
const destinationFilePath = process.argv[3];
const separator = process.argv[4];
const symbolToPrepend = process.argv[5];

const numberFormatter = spawn("node", [
  path.join(__dirname, "./number-formatter.js"),
  destinationFilePath,
  separator,
  symbolToPrepend,
]);

numberFormatter.stdout.on("data", (data) => {
  console.log(`Stdout: ${data}`);
});

numberFormatter.stderr.on("data", (data) => {
  console.log(`Stderr: ${data}`);
});

numberFormatter.on("close", (code) => {
  if (code === 0) {
    console.log(`The file was read, processed and written successfully!`);
  } else {
    console.log(`Something bad happened!`);
  }
});

const readFileStream = createReadStream(sourceFilePath);

readFileStream.pipe(numberFormatter.stdin);

// how to run: node dist/unix/massive-communication/index.js ./test.txt ./dest.txt $'\n' $
// the $ in $'\n' is because of how bash parses characters
