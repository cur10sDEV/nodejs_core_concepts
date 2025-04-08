import { createSocket } from "dgram";

const server = createSocket({ type: "udp4" });

server.on("message", (message, remoteInfo) => {
  console.log(message);
  console.log(remoteInfo);
});

server.bind({ port: 5050, address: "127.0.0.1" });

server.on("listening", () => {
  console.log(`Server listening on`, server.address());
});
