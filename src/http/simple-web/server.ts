import { open } from "fs/promises";
import http from "http";
import path from "path";

const server = http.createServer();

server.on("request", async (req, res) => {
  // html
  if (req.url === "/" && req.method === "GET") {
    res.setHeader("Content-Type", "text/html");

    const fileHandle = await open(
      path.join(__dirname, "/public/index.html"),
      "r"
    );
    const fileReadStream = fileHandle.createReadStream();

    fileReadStream.pipe(res);

    fileReadStream.on("end", () => {
      fileReadStream.close();
      fileHandle.close();
    });
  }
  // css
  if (req.url === "/styles.css" && req.method === "GET") {
    res.setHeader("Content-Type", "text/css");

    const fileHandle = await open(
      path.join(__dirname, "/public/styles.css"),
      "r"
    );
    const fileReadStream = fileHandle.createReadStream();

    fileReadStream.pipe(res);

    fileReadStream.on("end", () => {
      fileReadStream.close();
      fileHandle.close();
    });
  }
  // javascript
  if (req.url === "/index.js" && req.method === "GET") {
    res.setHeader("Content-Type", "text/javascript");

    const fileHandle = await open(
      path.join(__dirname, "/public/index.js"),
      "r"
    );
    const fileReadStream = fileHandle.createReadStream();

    fileReadStream.pipe(res);

    fileReadStream.on("end", () => {
      fileReadStream.close();
      fileHandle.close();
    });
  }
  // json
  if (req.url === "/login" && req.method === "POST") {
    res.setHeader("Content-Type", "application/json");

    res.statusCode = 200;
    res.statusMessage = "OK";

    res.end(JSON.stringify({ message: "Login Successfull!" }));
  }
  // upload
  if (req.url === "/upload" && req.method === "POST") {
    const fileHandle = await open(
      path.join(__dirname, "/storage/image.png"),
      "w"
    );
    const fileWriteStream = fileHandle.createWriteStream();

    req.pipe(fileWriteStream);

    req.on("end", () => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "File upload succcessfull!" }));
    });

    fileWriteStream.on("finish", () => {
      fileWriteStream.close();
      fileHandle.close();
    });
  }
});

server.on("connection", (socket) => {
  console.log(`New device connected`);
});

server.listen(3000, "127.0.0.1", () => {
  console.log(`Server started: `, server.address());
});
