import { NextFunction, Request, Response } from "express";
import { JwtUserPayload } from "../types/jwt-payload.types";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: JwtUserPayload;
}

export function isAuthenticated(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const cookieToken = req.cookies?.token as string | undefined;

  const authHeader = req.headers.authorization;
  const headerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : undefined;

  const token = cookieToken || headerToken;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Não autorizado. Token ausente." });
  }

  try {
    const decoded = verifyToken(token); 
    req.user = decoded;
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Não autorizado. Token inválido ou expirado." });
  }
}
