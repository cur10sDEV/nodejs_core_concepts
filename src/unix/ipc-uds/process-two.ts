import { createConnection } from "net";

const socketPath = "/tmp/ipc-uds.sock";

const client = createConnection(socketPath, () => {
  console.log("Connected to server!");
  client.write(JSON.stringify({ message: "Hello from client!" }));
});

client.on("data", (chunk) => {
  const data = JSON.parse(chunk.toString("utf-8"));
  console.log(`Server said: ${data.message}`);
  client.end();
});

client.on("end", () => {
  console.log(`Disconnected from server!`);
});
