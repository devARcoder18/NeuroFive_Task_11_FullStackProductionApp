import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthedRequest } from "../middleware/auth.middleware.js";
import * as authService from "../services/auth.service.js";
import { env } from "../config/env.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req, res: Response) => {
  const { token, user } = await authService.registerUser(req.body);
  res.cookie("token", token, cookieOptions);
  res.status(201).json({ token, user });
});

export const login = asyncHandler(async (req, res: Response) => {
  const { token, user } = await authService.loginUser(req.body);
  res.cookie("token", token, cookieOptions);
  res.status(200).json({ token, user });
});

export const logout = asyncHandler(async (_req, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out." });
});

export const me = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const user = await authService.getCurrentUser(req.userId!);
  res.status(200).json({ user });
});
