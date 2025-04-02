import EventEmitter from "events";

class MessageQueue {
  private queue: string[];
  private processing: boolean;
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
    this.queue = [];
    this.processing = false;
  }

  addMessage(message: string) {
    this.eventEmitter.emit("message:received", message);
    this.queue.push(message);
    this.eventEmitter.emit("message:queued", message);
    this.processQueue();
  }

  private async processQueue() {
    if (this.queue.length <= 0 && this.processing) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const message = this.queue.shift();

      this.eventEmitter.emit("message:processing", message);

      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });

      this.eventEmitter.emit("message:processed", message);
    }
    this.processing = false;
  }

  addListener(event: string, listener: (...args: any[]) => void) {
    this.eventEmitter.on(event, listener);
  }
}

const msgQueue = new MessageQueue();

msgQueue.addListener("message:received", (message) =>
  console.log(`[Event] Received: ${message}`)
);
msgQueue.addListener("message:queued", (message) =>
  console.log(`[Event] Queued: ${message}`)
);
msgQueue.addListener("message:processing", (message) =>
  console.log(`[Event] Processing: ${message}`)
);
msgQueue.addListener("message:processed", (message) =>
  console.log(`[Event] Processed: ${message}`)
);

for (let i = 0; i < 10; i++) {
  msgQueue.addMessage(`Msg: ${i}`);
}
