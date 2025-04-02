import { open } from 'node:fs/promises';

(async () => {
    console.time('read');
    const fileHandleRead = await open('./test.txt', 'r');
    const fileHandleWrite = await open('./copy.txt', 'w');

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
})();
