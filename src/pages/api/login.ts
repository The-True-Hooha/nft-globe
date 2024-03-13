import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { serialize } from "cookie";
import { genSalt, hash, compareSync } from "bcrypt";
import { Secret, sign } from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, password } = req.body;
    const joinBody = `${email}+${password}`;
    const hashAuthDetails = await hashString(joinBody);
    const readPasswordFile = fs
      .readFileSync("password.txt", "utf-8")
      .split("\n");
    for (const hashedValue of readPasswordFile) {
      if (compareSync(hashAuthDetails, hashedValue)) {
        break;
      }
    }
    const checkHashExist = readPasswordFile.some((v) =>
      compareSync(joinBody, v)
    );
    if (!checkHashExist) {
      res.status(401).send({
        message: "password or email does not exist",
        data: null,
      });
      }
       res.setHeader("Set-Cookie", setCookieProps(email));
       res.status(200).send({
         message: "login successful",
         data: setCookieProps(email),
       });
  } catch (err: any) {
    res.status(500).send({ message: "Internal server error", error: err });
  }
}

async function hashString(text: string): Promise<string> {
  const saltRounds = Number(process.env.SALT_ROUNDS);
  const salt = await genSalt(saltRounds);
  const hashedPassword = await hash(text, salt);
  return hashedPassword;
}

function setCookieProps(email: string): string {
  const atCookie = serialize("fronk-cartel", createAccessToken(email), {
    httpOnly: false,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 3, // expires in 3 days
    path: "/",
  });
  return atCookie;
}

const createAccessToken = (email: string): string => {
  const expiresIn = "3d"; // 72 hours
  return sign({ email: email }, process.env.ACCESS_TOKEN_SECRET as Secret, {
    expiresIn: expiresIn,
  });
};
