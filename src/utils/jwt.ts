import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtUserPayload } from "../types/jwt-payload.types";

const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";

export function generateAccessToken(payload: JwtUserPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function generateRefreshToken(payload: JwtUserPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verifyToken(token: string): JwtUserPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;
}
