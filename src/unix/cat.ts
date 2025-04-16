// A simple command line utility
import { createReadStream } from "fs";
import { argv, exit, stdin, stdout } from "process";

const filePath = argv[2];

const readFileStream = createReadStream(filePath);
readFileStream.pipe(stdout);
readFileStream.on("end", () => {
  stdout.write("\n");
  exit(0);
});

stdin.pipe(stdout);
