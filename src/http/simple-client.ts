import http from "http";

const agent = new http.Agent({ keepAlive: true });

// let str = "";
// for (let i = 0; i < 2048; i++) {
//   str += `${i}`;
// }

const request = http.request({
  agent,
  method: "POST",
  hostname: "localhost",
  port: 3000,
  headers: {
    "content-type": "application/json",
    // "content-length": Buffer.byteLength(
    //   JSON.stringify({ message: str }),
    //   "utf-8"
    // ),
  },
  path: "/posts",
});

// this event is emitted only once
// capturing incoming responses
request.on("response", (response) => {
  console.log("--- STATUS CODE ---");
  console.log(response.statusCode);

  console.log("--- HEADERS ---");
  console.log(response.headers);

  // reading response data
  response.on("data", (chunk) => {
    console.log("--- BODY ---");
    console.log(JSON.parse(chunk.toString()));
  });

  response.on("end", () => {
    console.log("No more data in response!!!");
  });
});

request.end(
  JSON.stringify({
    title: "Summary: How to win friends and influence people",
    body: "Sorry I haven't read the book yet :-).",
  })
);

// // the message will be trimmed to fit the size declared in the headers
// request.write(JSON.stringify({ message: str }));
