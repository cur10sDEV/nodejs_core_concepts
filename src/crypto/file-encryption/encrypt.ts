import { createCipheriv, pbkdf2, randomBytes } from "node:crypto";
import { appendFileSync, createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream";

// our master password
const password = process.env.FE_PASSWORD || "nonSecurePassword";

const algorithm = "aes-256-gcm";

const salt = randomBytes(16); // salt for key derivation function
const iv = randomBytes(16); // additional padding will be added to make it a nonce - final will be 128 bits/16 bytes from 96bits/12bytes

pbkdf2(password, salt, 1_000_000, 32, "sha512", (err, derivedKey) => {
  if (err) return console.error(err);

  const cipher = createCipheriv(algorithm, derivedKey, iv);

  const plainText = createReadStream("./data.txt");
  const output = createWriteStream("./data-encrypted.enc");

  // add encryption metadata to the start of the encrypted file
  output.write(salt); // 16 bytes
  output.write(iv); // 16 bytes

  pipeline(plainText, cipher, output, (err) => {
    if (err) return console.error(err);

    // MAC (Message Authentication Code)
    const authCode = cipher.getAuthTag();

    // write MAC to the end of the file
    appendFileSync("./data-encrypted.enc", authCode); // 16 bytes

    console.log(salt.toString("hex"));
    console.log(iv.toString("hex"));
    console.log(authCode.toString("hex"));

    console.log("Encryption Completed!!!");
  });
});

/*
### Encrypted File Structure ###
First 16 bytes: Salt
Second 16 bytes: IV
Everything in between: Cipher Text
Last 16 bytes: MAC
*/
