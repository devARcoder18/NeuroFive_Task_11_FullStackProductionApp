import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface JwtPayload {
  sub: string;
}

export const signToken = (userId: string): string =>
  jwt.sign({ sub: userId } satisfies JwtPayload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);

export const verifyToken = (token: string): JwtPayload => jwt.verify(token, env.jwtSecret) as JwtPayload;
