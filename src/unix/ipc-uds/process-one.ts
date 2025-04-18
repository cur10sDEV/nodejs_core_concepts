// IPC (Inter-Process Communication) using UDS (Unix Domain Sockets)
import { existsSync, unlinkSync } from "fs";
import { createServer, Socket } from "net";

const socketPath = "/tmp/ipc-uds.sock";

// if socket exists already delete that
if (existsSync(socketPath)) unlinkSync(socketPath);

const clients: Socket[] = [];

const server = createServer((socket) => {
  console.log(`Client Connected`);
  clients.push(socket);

  socket.on("data", (chunk) => {
    const data = JSON.parse(chunk.toString("utf-8"));
    console.log(`Client said: ${data.message}`);
    socket.write(JSON.stringify({ message: "Hello from server!" }));
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
