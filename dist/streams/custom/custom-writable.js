"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const stream_1 = require("stream");
class FileWriteStream extends stream_1.Writable {
    constructor({ highWaterMark, fileName, }) {
        super({ highWaterMark });
        this.fileName = fileName;
        this.fd = null;
        this.chunks = [];
        this.chunksSize = 0;
        this.writeCount = 0;
    }
    // this will run after the constructor, halting all other methods invocation until callback is called
    _construct(callback) {
        fs_1.default.open(this.fileName, "w", (err, fd) => {
            if (err) {
                return callback(err);
            }
            this.fd = fd;
            // no arguments passed means no error
            callback();
        });
    }
    _write(chunk, encoding, callback) {
        this.chunks.push(chunk);
        this.chunksSize += chunk.length;
        // if chunks is full then write - handling backpressure
        if (this.chunksSize > this.writableHighWaterMark) {
            if (this.fd) {
                fs_1.default.write(this.fd, Buffer.concat(this.chunks), (err) => {
                    if (err)
                        return callback(err);
                    this.chunks = [];
                    this.chunksSize = 0;
                    ++this.writeCount;
                    callback();
                });
            }
        }
        else {
            callback();
        }
    }
    _final(callback) {
        if (this.fd) {
            fs_1.default.write(this.fd, Buffer.concat(this.chunks), (err) => {
                if (err)
                    return callback(err);
                this.chunks = [];
                ++this.writeCount;
                callback();
            });
        }
    }
    _destroy(error, callback) {
        if (this.fd) {
            fs_1.default.close(this.fd, (err) => {
                console.log(`WriteCount: ${this.writeCount}`);
                callback(err || error);
            });
        }
        else {
            callback(error);
        }
    }
}
/* Example */
(() => __awaiter(void 0, void 0, void 0, function* () {
    const writeCount = 1000000;
    console.time("writeMany");
    const stream = new FileWriteStream({ fileName: "sample.txt" });
    let i = 1;
    let drainCount = 0;
    function writeMany() {
        while (i <= writeCount) {
            if (stream.writableLength >= stream.writableHighWaterMark) {
                break;
            }
            const buff = Buffer.from(`${i}\n`, "utf-8");
            if (i === writeCount) {
                return stream.end(buff);
            }
            stream.write(buff);
            i++;
        }
    }
    writeMany();
    stream.on("drain", () => {
        drainCount++;
        writeMany();
    });
    stream.on("finish", () => {
        console.timeEnd("writeMany");
        console.log({ drainCount });
    });
}))();
