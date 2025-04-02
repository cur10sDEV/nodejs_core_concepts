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
const promises_1 = require("fs/promises");
const stream_1 = require("stream");
// (async () => {
//     console.time('copy');
//     const srcFile = await open('./test.txt', 'r');
//     const destFile = await open('./copy.txt', 'w');
//     let bytesRead = -1;
//     while (bytesRead !== 0) {
//         const data = await srcFile.read();
//         bytesRead = data.bytesRead;
//         // last buffer may not be full, leaving zeroes - translating to "null"s in file
//         if (bytesRead < 16384) {
//             const newBuffer = Buffer.alloc(bytesRead);
//             data.buffer.copy(newBuffer, 0, 0, bytesRead);
//             destFile.write(newBuffer);
//         } else {
//             destFile.write(data.buffer);
//         }
//     }
//     console.timeEnd('copy');
// })();
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.time('copy');
    const srcFile = yield (0, promises_1.open)('./test.txt', 'r');
    const destFile = yield (0, promises_1.open)('./copy.txt', 'w');
    const readStream = srcFile.createReadStream();
    const writeStream = destFile.createWriteStream();
    // .pipe() can only be called on a readable stream
    (0, stream_1.pipeline)(readStream, writeStream, (err) => {
        if (err) {
            console.error('An error occurred!');
        }
        else {
            console.timeEnd('copy');
        }
    });
}))();
