import EventEmitter from "events";

class Emitter extends EventEmitter {}

const emitter = new Emitter();

emitter.on("test", () => console.log("test fired"));
emitter.on("test", (x) => console.log(`test fired with: ${x}`));

emitter.emit("test", "x");
