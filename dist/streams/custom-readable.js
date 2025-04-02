"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const stream_1 = require("stream");
class FileReadStream extends stream_1.Readable {
    constructor({ highWaterMark, fileName, }) {
        super({ highWaterMark });
        this.fileName = fileName;
        this.fd = null;
    }
    _construct(callback) {
        fs_1.default.open(this.fileName, "r", (err, fd) => {
            if (err)
                return callback(err);
            this.fd = fd;
            callback();
        });
    }
    _read(size) {
        const buff = Buffer.alloc(size);
        if (this.fd) {
            // @ts-ignore
            fs_1.default.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
                if (err)
                    return this.destroy(err);
                // handling zeroes(nulls) at last - i.e., empty/partly-empty buffer
                this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
            });
        }
    }
}
const readStream = new FileReadStream({ fileName: "sample.txt" });
readStream.on("data", (chunk) => {
    console.log(chunk.toString());
});
readStream.on("end", () => {
    console.log(`File reading done`);
});
