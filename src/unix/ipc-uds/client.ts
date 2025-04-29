import { createConnection, Socket } from "net";

const socketPath = "/tmp/ipc-uds.sock";

const client = createConnection(socketPath, () => {
  console.log("Connected to server!");
  if (Math.floor(Math.random() * 10) < 3) {
    sendMessage(client, "stream", "log");
  } else {
    sendMessage(client, "broadcast", "Mr. Robot has joined the server!");
  }
});

client.on("data", (chunk) => {
  try {
    const data = JSON.parse(chunk.toString("utf-8"));
    console.log(`Server: ${data.type}: ${data.data}`);

    // client.end();
  } catch (error) {
    console.error("Invalid JSON received", chunk.toString("utf-8"));
  }
});

client.on("end", () => {
  console.log(`Disconnected from server!`);
});

function sendMessage(client: Socket, type: string, data: string) {
  client.write(
    JSON.stringify({
      from: "client",
      type,
      data,
    })
  );
}
