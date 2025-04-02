const size = 100_000_000;
const normalArray: number[] = new Array(size).fill(0);
const typedArray = new Float64Array(size);

console.time("Normal Array");
for (let i = 0; i < size; i++) normalArray[i] = Math.random();
console.timeEnd("Normal Array");

console.time("Typed Array");
for (let i = 0; i < size; i++) typedArray[i] = Math.random();
console.timeEnd("Typed Array");
