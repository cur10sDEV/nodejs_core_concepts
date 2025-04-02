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
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("node:fs/promises");
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.time('read');
    const fileHandleRead = yield (0, promises_1.open)('./test.txt', 'r');
    const fileHandleWrite = yield (0, promises_1.open)('./copy.txt', 'w');
    const readStream = fileHandleRead.createReadStream();
    const writeStream = fileHandleWrite.createWriteStream();
    readStream.on('data', (chunk) => {
        chunk
            .toString('utf-8')
            .split('\n')
            .forEach((data) => {
            if (parseInt(data) % 2 === 0) {
                if (!writeStream.write(`${data}\n`)) {
                    readStream.pause();
                }
            }
        });
    });
    writeStream.on('drain', () => {
        readStream.resume();
    });
    readStream.on('end', () => {
        console.timeEnd('read');
    });
}))();
