import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

export interface AuthedRequest extends Request {
  userId?: string;
}

export function authMiddleware(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const cookieToken = (req as any).cookies?.token;
  const token = cookieToken || (header?.startsWith("Bearer ") ? header.slice(7) : undefined);

  if (!token) {
    return next(new AppError("You must be logged in to do that.", 401));
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    next(new AppError("Your session has expired. Please log in again.", 401));
  }
}
