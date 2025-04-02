"use strict";
/*
mem 47MB
cpu 9.5%
time 60s
*/
// import fs from 'node:fs/promises';
// (async () => {
//     console.time('writeMany');
//     const fileHandler = await fs.open('./test.txt', 'w');
//     for (let i = 1; i <= 1_000_000; i++) {
//         await fileHandler.write(`${i}\n`);
//     }
//     console.timeEnd('writeMany');
// })();
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
/*
mem 28MB
cpu 8.7%
time 11s
*/
// import fs from 'node:fs';
// (async () => {
//     console.time('writeMany');
//     fs.open('./test.txt', 'w', (err, fd) => {
//         for (let i = 1; i <= 1_000_000; i++) {
//             fs.writeSync(fd, Buffer.from(`${i}\n`, 'utf-8'));
//         }
//         console.timeEnd('writeMany');
//     });
// })();
/*
mem 1.2GB
cpu 44%
time 4s
*/
// import fs from 'node:fs';
// (async () => {
//     console.time('writeMany');
//     fs.open('./test.txt', 'w', (err, fd) => {
//         for (let i = 1; i <= 1_000_000; i++) {
//             fs.write(fd, Buffer.from(`${i}\n`, 'utf-8'), () => {});
//         }
//         console.timeEnd('writeMany');
//     });
// })();
/*
mem 50 MB
cpu ??
time 600ms
*/
const promises_1 = __importDefault(require("node:fs/promises"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const writeCount = 100000000;
    console.time('writeMany');
    const fileHandler = yield promises_1.default.open('./test.txt', 'w');
    const stream = fileHandler.createWriteStream();
    let i = 1;
    let drainCount = 0;
    function writeMany() {
        while (i <= writeCount) {
            if (stream.writableLength >= stream.writableHighWaterMark) {
                break;
            }
            const buff = Buffer.from(`${i}\n`, 'utf-8');
            if (i === writeCount) {
                return stream.end(buff);
            }
            stream.write(buff);
            i++;
        }
    }
    writeMany();
    stream.on('drain', () => {
        drainCount++;
        writeMany();
    });
    stream.on('finish', () => {
        console.timeEnd('writeMany');
        console.log({ drainCount });
        fileHandler.close();
    });
}))();
