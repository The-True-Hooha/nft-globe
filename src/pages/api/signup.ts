import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { genSalt, hash, compareSync } from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;
  const joinBody = `${email}+${password}`;
  const hashAuthDetails = await hashString(joinBody);
  try {
    const readPasswordFile = fs
      .readFileSync("password.txt", "utf-8")
      .split("\n");

    const checkHashExist = readPasswordFile.some((v) =>
      compareSync(joinBody, v)
    );
    if (checkHashExist) {
      res.status(400).send({ message: "this email or password already exist" });
    } else {
      fs.appendFileSync("password.txt", `${hashAuthDetails}`);
      res.status(201).send({ message: "signup successful" });
    }
  } catch (err: any) {
    if (err.code === "ENOENT") {
      fs.writeFileSync("password.txt", `${hashAuthDetails}\n`);
      res.status(201).send({ message: "Signup successful" });
    } else {
      res.status(500).send({ message: "Internal server error" });
    }
  }
  
}

async function hashString(text: string): Promise<string> {
  const saltRounds = Number(process.env.SALT_ROUNDS);
  const salt = await genSalt(saltRounds);
  const hashedPassword = await hash(text, salt);
  return hashedPassword;
}
