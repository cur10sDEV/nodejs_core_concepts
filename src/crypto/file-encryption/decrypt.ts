import { createDecipheriv, pbkdf2 } from "node:crypto";
import {
  createReadStream,
  createWriteStream,
  fstatSync,
  openSync,
  readSync,
} from "node:fs";
import { pipeline } from "node:stream";

const password = process.env.FE_PASSWORD || "nonSecurePassword";

const algorithm = "aes-256-gcm";

const salt = Buffer.alloc(16);
const iv = Buffer.alloc(16);
const authCode = Buffer.alloc(16);

const fd = openSync("./data-encrypted.enc", "r");
const fileSize = fstatSync(fd).size;

readSync(fd, salt, 0, 16, 0);
readSync(fd, iv, 0, 16, 16);
readSync(fd, authCode, 0, 16, fileSize - 16);

console.log(salt.toString("hex"));
console.log(iv.toString("hex"));
console.log(authCode.toString("hex"));

pbkdf2(password, salt, 1_000_000, 32, "sha512", (err, derivedKey) => {
  if (err) return console.error(err);

  const decipher = createDecipheriv(algorithm, derivedKey, iv);
  // set the mac for verification
  decipher.setAuthTag(authCode);

  const input = createReadStream("./data-encrypted.enc", {
    start: 32, // excluding the salt and iv
    end: fileSize - (16 + 1), // excluding the mac
  });

  const plainText = createWriteStream("./data-decrypted.txt");

  pipeline(input, decipher, plainText, (err) => {
    if (err) return console.error(err);

    console.log("Decryption Completed!!!");
  });
});
