import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "1d",
  });
}
