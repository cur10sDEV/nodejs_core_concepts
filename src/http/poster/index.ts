import path from "path";
import { Butter } from "./butter";

const SESSIONS = new Map<string, number>();

const USERS = [
  {
    id: 1,
    name: "Elliot Alderson",
    username: "the.mastermind",
    password: "control_is_an_illusion",
  },
];

const POSTS = [
  {
    id: 1,
    title: "How to hack the world for beginners",
    body: "No you can't. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus aliquam consequatur, mollitia repellat maiores cum ex debitis error ad est explicabo vel magnam dolores, animi laborum assumenda? Dolorem laudantium vel soluta tenetur tempora fugiat enim, cum harum totam tempore aperiam cumque! Expedita nam, modi quo officia maiores quidem animi provident.",
    userId: 1,
  },
];

const server = new Butter();

// ------ MIDDLEWARES ------

// parsing json body - NOTE: we are not handling backpressure here or when sending response
server.beforeEach((req, res, next) => {
  // --------------------- REQUEST ---------------------
  if (req.headers["content-type"] === "application/json") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    // body as simple string
    req.on("end", () => {
      body = JSON.parse(body);
      req.body = body;
      return next();
    });
  } else {
    next();
  }
});

// authentication
server.beforeEach((req, res, next) => {
  const routesToAuthenticate = [
    "get_/api/user",
    "put_/api/user",
    "post_/api/posts",
  ];

  if (
    routesToAuthenticate.includes(`${req.method?.toLowerCase()}_${req.url}`)
  ) {
    if (req.headers.cookie) {
      const token = req.headers.cookie.split("=")[1];

      if (token && SESSIONS.has(token)) {
        const user = USERS.find((user) => user.id === SESSIONS.get(token));
        req.userId = user?.id;
        return next();
      }
    }
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
});

server.beforeEach((req, res, next) => {
  const routes = ["/", "/login", "/profile"];
  if (req.url && routes.includes(req.url) && req.method === "GET") {
    return res.sendFile(
      path.join(__dirname, "./public/index.html"),
      "text/html"
    );
  } else {
    next();
  }
});

// ------ FILES ROUTES ------
server.route("get", "/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/styles.css"), "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/scripts.js"), "text/javascript");
});

// ------ JSON ROUTES ------

// Get all posts
server.route("get", "/api/posts", (req, res) => {
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id === post.userId);

    return {
      ...post,
      author: user?.name,
    };
  });
  res.status(200).json(posts);
});

// user login
server.route("post", "/api/login", (req, res) => {
  const userInput = req.body;

  const user = USERS.find((user) => user.username === userInput.username);

  if (user && user.password === userInput.password) {
    const token = crypto.randomUUID();

    // save session
    SESSIONS.set(token, user.id);

    // set cookie
    res.setHeader("Set-Cookie", `token=${token}; Path=/;`);

    res.status(200).json({ message: "Logged in successfully!" });
  } else {
    res.status(401).json({ message: "Invalid username or password!" });
  }
});

// user logout
server.route("delete", "/api/logout", (req, res) => {
  let sessionToDelete;
  SESSIONS.forEach((value, key) => {
    if (value === req.userId) {
      sessionToDelete = key;
    }
  });

  if (sessionToDelete) {
    SESSIONS.delete(sessionToDelete);
  }

  res.setHeader(
    "Set-Cookie",
    "token=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );
  res.status(200).json({ message: "Logged out successfully!" });
});

// get user profile
server.route("get", "/api/user", (req, res) => {
  const user = USERS.find((user) => user.id === req.userId);
  res.status(200).json({ ...user });
});

// update user
server.route("put", "/api/user", (req, res) => {
  const userInput = req.body;

  const user = USERS.find((user) => user.id === req.userId)!;

  user.username = userInput.username;
  user.name = userInput.name;
  user.password = userInput.password ? userInput.password : user.password;

  res.status(200).json({
    username: user.username,
    name: user.name,
    password_status: userInput.password ? "updated" : "not updated",
  });
});

// create a new post
server.route("post", "/api/posts", (req, res) => {
  const userInput = req.body;

  const user = USERS.find((user) => user.id === req.userId);

  const newPost = {
    id: POSTS.length + 1,
    title: userInput.title as string,
    body: userInput.body as string,
    userId: user?.id!,
  };

  POSTS.unshift(newPost);

  res.status(200).json({ ...user });
});

server.listen(3000, () => {
  console.log(`Server started on port ${3000}`);
});
