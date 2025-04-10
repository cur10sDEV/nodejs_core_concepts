import http from "http";

const server = http.createServer();

// capturing incoming requests
server.on("request", (req, res) => {
  console.log("--- HEADERS ---");
  console.log(req.headers);

  console.log("--- METHOD ---");
  console.log(req.method);

  console.log("--- URL ---");
  console.log(req.url);

  // reading incoming requests data
  let data = "";
  req.on("data", (chunk) => {
    data += chunk.toString();
  });

  // when request finishes
  req.on("end", () => {
    console.log("--- BODY ---");
    console.log(JSON.parse(data));

    // writing to outgoing response
    res.writeHead(200, { "content-type": "application/json" });
    // res.setHeader("Content-Length", 1024)
    res.end(JSON.stringify({ message: "Post created successfully!" }));
  });
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
