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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
class MessageQueue {
    constructor() {
        this.eventEmitter = new events_1.default();
        this.queue = [];
        this.processing = false;
    }
    addMessage(message) {
        this.eventEmitter.emit("message:received", message);
        this.queue.push(message);
        this.eventEmitter.emit("message:queued", message);
        this.processQueue();
    }
    processQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.queue.length <= 0 && this.processing)
                return;
            this.processing = true;
            while (this.queue.length > 0) {
                const message = this.queue.shift();
                this.eventEmitter.emit("message:processing", message);
                yield new Promise((resolve) => {
                    setTimeout(resolve, 2000);
                });
                this.eventEmitter.emit("message:processed", message);
            }
            this.processing = false;
        });
    }
    addListener(event, listener) {
        this.eventEmitter.on(event, listener);
    }
}
const msgQueue = new MessageQueue();
msgQueue.addListener("message:received", (message) => console.log(`[Event] Received: ${message}`));
msgQueue.addListener("message:queued", (message) => console.log(`[Event] Queued: ${message}`));
msgQueue.addListener("message:processing", (message) => console.log(`[Event] Processing: ${message}`));
msgQueue.addListener("message:processed", (message) => console.log(`[Event] Processed: ${message}`));
for (let i = 0; i < 10; i++) {
    msgQueue.addMessage(`Msg: ${i}`);
}
