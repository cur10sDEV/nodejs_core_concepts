import path from "path";
import { Butter } from "./butter";

const server = new Butter();

server.route("get", "/text", (req, res) => {
  res.status(200).send("Hello World!!!");
});

server.route("get", "/json", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

server.route("get", "/", (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, "assets/index.html"), "text/html");
});

server.listen(3000, () => {
  console.log(`Server started on port 3000`);
});
