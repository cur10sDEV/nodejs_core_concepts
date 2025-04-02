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
class Encryption extends stream_1.Transform {
    _transform(chunk, encoding, callback) {
        for (let i = 0; i < chunk.length; ++i) {
            if (chunk[i] !== 255) {
                chunk[i] -= 1;
            }
        }
        callback(null, chunk);
    }
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const readFileHandle = yield (0, promises_1.open)("encrypted.txt", "r");
    const writeFileHandle = yield (0, promises_1.open)("decrypted.txt", "w");
    const encryption = new Encryption();
    const readStream = readFileHandle.createReadStream();
    const writeStream = writeFileHandle.createWriteStream();
    readStream.pipe(encryption).pipe(writeStream);
}))();
