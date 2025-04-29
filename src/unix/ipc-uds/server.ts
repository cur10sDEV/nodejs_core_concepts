// IPC (Inter-Process Communication) using UDS (Unix Domain Sockets)
import { existsSync, unlinkSync } from "fs";
import { createServer, Socket } from "net";

const socketPath = "/tmp/ipc-uds.sock";

// delete if socket exists already
if (existsSync(socketPath)) unlinkSync(socketPath);

const clients: Socket[] = [];

const server = createServer((socket) => {
  console.log(`Client Connected`);
  clients.push(socket);

  socket.on("data", (chunk) => {
    try {
      const data = JSON.parse(chunk.toString("utf-8"));
      console.log(`Client: ${data.type}: ${data.data}`);

      // broadcast
      if (data.type === "broadcast") {
        broadcast(socket, data.data);
      }

      // stream
      else if (data.type === "stream") {
        if (data.data === "log") {
          const streamInterval = setInterval(() => {
            if (socket.destroyed) return clearInterval(streamInterval);

            streamMessage(socket, "log", new Date().toISOString());
          }, 1000);
          return;
        }
      }
    } catch (error) {
      console.error("Invalid JSON received", chunk.toString("utf8"));
    }
  });

  socket.on("end", () => {
    console.log(`Client Disconnected`);
    const socketIndex = clients.indexOf(socket);
    if (socketIndex !== -1) clients.splice(socketIndex, 1);
  });
});

server.listen(socketPath, () => {
  console.log(`Server listening on ${socketPath}`);
});

/* ------------------------------------------ Utility Functions ------------------------------------------*/
function broadcast(fromSocket: Socket, data: string) {
  // send to all other clients
  clients.forEach((client) => {
    if (client !== fromSocket) {
      sendMessage(client, "broadcast", data);
    }
  });
}

function sendMessage(client: Socket, type: string, data: string) {
  client.write(
    JSON.stringify({
      from: "server",
      type,
      data,
    })
  );
}

function streamMessage(client: Socket, resource: string, timestamp: string) {
  sendMessage(client, "stream", `[${resource}] - timestamp: ${timestamp}`);
}

/* ------------------------------------------ Utility Functions ------------------------------------------*/
