import net from "net";

const socket = net.createConnection(
  {
    host: "127.0.0.1",
    port: 3000,
  },
  () => {
    // sending http headers and body on top of tcp to simulate http connection (data as hex copied from wireshark of another request)
    const head = Buffer.from(
      "504f5354202f706f73747320485454502f312e310d0a636f6e74656e742d747970653a206170706c69636174696f6e2f6a736f6e0d0a486f73743a206c6f63616c686f73743a333030300d0a436f6e6e656374696f6e3a206b6565702d616c6976650d0a436f6e74656e742d4c656e6774683a203130380d0a0d0a",
      "hex"
    );

    const body = Buffer.from(
      "7b227469746c65223a2253756d6d6172793a20486f7720746f2077696e20667269656e647320616e6420696e666c75656e63652070656f706c65222c22626f6479223a22536f727279204920686176656e277420726561642074686520626f6f6b20796574203a2d292e227d",
      "hex"
    );

    socket.write(Buffer.concat([head, body]));
    socket.end();
  }
);

socket.on("data", (chunk) => {
  console.log("Recieved Response:");
  console.log(chunk.toString("utf-8"));
  console.log(chunk.toString("hex"));
  socket.end();
});

socket.on("error", console.error);
