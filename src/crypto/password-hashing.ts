import { pbkdf2, randomBytes } from "node:crypto";
import { promisify } from "node:util";

const pbkdf2Async = promisify(pbkdf2);

async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const iterations = 1_000_000;
  const keyLength = 32;
  const digest = "sha256";

  const hashedPassword = await pbkdf2Async(
    password,
    salt,
    iterations,
    keyLength,
    digest
  );

  const final = hashedPassword.toString("hex") + ":" + salt.toString("hex");

  return final;
}

async function verifyPassword(
  hashedPasswordWithSalt: string,
  password: string
) {
  const iterations = 1_000_000;
  const keyLength = 32;
  const digest = "sha256";

  const [hashedPasswordHex, saltHex] = hashedPasswordWithSalt.split(":");
  const hashedPassword = Buffer.from(hashedPasswordHex, "hex");
  const salt = Buffer.from(saltHex, "hex");

  const generatedHash = await pbkdf2Async(
    password,
    salt,
    iterations,
    keyLength,
    digest
  );
  return generatedHash.toString("hex") === hashedPassword.toString("hex");
}

const password = "my_super_secret_password";

(async () => {
  const hashedPasswordWithSalt = await hashPassword(password);
  console.log("Hashed Password : ", hashedPasswordWithSalt);
  console.log(await verifyPassword(hashedPasswordWithSalt, password));
})();
