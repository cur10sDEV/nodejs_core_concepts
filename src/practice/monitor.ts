import EventEmitter from "events";
import { freemem, totalmem } from "os";

class Monitor {
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  mem(threshold: number, listener: (...args: any[]) => void) {
    const intervalId = setInterval(() => {
      const availableMem = freemem();
      const totalMem = totalmem();
      const usageInPercent = ((totalMem - availableMem) / totalMem) * 100;
      if (usageInPercent > threshold) {
        this.eventEmitter.emit("memory:limit_exceeded");
        clearInterval(intervalId);
      }
    }, 1000);

    this.eventEmitter.on("memory:limit_exceeded", listener);
  }
}

const monitor = new Monitor();

monitor.mem(75, () => {
  console.warn(
    JSON.stringify({ warning: "Memory limit exceeded, usage above 75%" })
  );
});
