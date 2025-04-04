import net from "net";

const socket = net.createConnection(
  {
    host: "127.0.0.1",
    port: 3000,
  },
  () => {
    socket.write("Hello from client");
  }
);

socket.on("error", console.error);
