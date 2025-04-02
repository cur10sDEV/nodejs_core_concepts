import { Buffer } from 'buffer';

// const myBuffer = Buffer.alloc(3);

// write as int
// myBuffer.writeInt8(72, 0);
// myBuffer.writeInt8(105, 1);
// myBuffer.writeInt8(33, 2);

// or as hex
// myBuffer[0] = 0x48;
// myBuffer[1] = 0x69;
// myBuffer[2] = 0x21;

// or
// const myBuffer = Buffer.from([0x48, 0x69, 0x21]);

// or
const myBuffer = Buffer.from('486921', 'hex');

console.log(myBuffer);
console.log(myBuffer.toString('utf-8'));
