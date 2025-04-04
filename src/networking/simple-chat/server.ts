import net, { Socket } from "net";

const server = net.createServer();

const users: Map<Socket, string> = new Map();

server.on("connection", (socket) => {
  socket.on("data", (data) => {
    const socketData = JSON.parse(data.toString());

    if (socketData.type === "JOIN") {
      users.set(socket, socketData.username);
    } else if (socketData.type === "MESSAGE") {
      users.forEach((username, socketId) => {
        socketId.write(data);
      });
    }
  });

  socket.on("close", () => {
    const username = users.get(socket);
    if (username) {
      socket.write(`${username} left the chat!!!`);
    }
  });
});

server.listen(3000, "127.0.0.1", () => {
  console.log(`Server started on`, server.address());
});
