"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const os_1 = require("os");
class Monitor {
    constructor() {
        this.eventEmitter = new events_1.default();
    }
    mem(threshold, listener) {
        const intervalId = setInterval(() => {
            const availableMem = (0, os_1.freemem)();
            const totalMem = (0, os_1.totalmem)();
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
    console.warn(JSON.stringify({ warning: "Memory limit exceeded, usage above 75%" }));
});
