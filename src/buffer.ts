// import { Buffer } from "buffer";
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
// const myBuffer = Buffer.from('486921', 'hex');
// console.log(myBuffer);
// console.log(myBuffer.toString('utf-8'));

// const buf = Buffer.from("This is a string");
// const buf2 = new Uint8Array(16);

// manipulation
// buf[0] = 65;
// buf2[0] = 255;

// console.log(buf); // logs the hex representation
// console.log(buf2); // logs the integer representation

// logs the actual buffer - instance of ArrayBuffer
// console.log(buf.buffer); // logs the full internal pool - 8KB
// console.log(buf2.buffer);

// get the actual data from the whole pool
// console.log("start", buf.byteOffset);
// console.log("end", buf.byteLength);

// string representation
// console.log(buf.toString("utf-8"));
// console.log(buf2.toString());

// Raw Buffer - really low level
// you cant really do much with this
// that is why you need a view to interact with it
const rawBuf = new ArrayBuffer(20);
const viewBuf = new Uint8Array(rawBuf);
viewBuf[2] = 250;
console.log(rawBuf); // data changed
