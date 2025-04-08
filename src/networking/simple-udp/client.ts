import { createSocket } from "dgram";

const client = createSocket("udp4");

client.send(
  "This is a message from client",
  5050,
  "127.0.0.1",
  (error, bytes) => {
    if (error) console.error(error);
    console.log(bytes);
  }
);
