import { open } from 'fs/promises';
import { pipeline } from 'stream';

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

(async () => {
    console.time('copy');
    const srcFile = await open('./test.txt', 'r');
    const destFile = await open('./copy.txt', 'w');

    const readStream = srcFile.createReadStream();
    const writeStream = destFile.createWriteStream();

    // .pipe() can only be called on a readable stream
    pipeline(readStream, writeStream, (err) => {
        if (err) {
            console.error('An error occurred!');
        } else {
            console.timeEnd('copy');
        }
    });
})();
