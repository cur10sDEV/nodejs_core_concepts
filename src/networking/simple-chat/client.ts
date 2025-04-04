import net from "net";
import readline from "readline/promises";
import { Direction } from "tty";

let username: string;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = net.createConnection({ port: 3000, host: "127.0.0.1" });

(async () => {
  username = await rl.question("Enter your username > ");
  await moveCursor(0, -1);
  await clearLine(0);
  client.write(JSON.stringify({ type: "JOIN", username }));
  chat();
})();

client.on("data", async (data) => {
  const userData = JSON.parse(data.toString());

  if (typeof username === "string") {
    await moveCursor(-1, 0);
    process.stdout.cursorTo(0);
    await clearLine(0);
    console.log(`${userData.username}: ${userData.message}\n`);
    chat();
  }
});

client.on("end", () => {
  console.log(`Client Disconnected!!!`);
});

async function chat() {
  const clientMessage = await rl.question("message > ");
  await moveCursor(0, -1);
  await clearLine(0);
  client.write(
    JSON.stringify({ type: "MESSAGE", username, message: clientMessage })
  );
}

async function clearLine(dir: Direction): Promise<void> {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
}

async function moveCursor(x: number, y: number): Promise<void> {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(x, y, () => {
      resolve();
    });
  });
}
