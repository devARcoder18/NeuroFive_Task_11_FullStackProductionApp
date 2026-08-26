import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthedRequest } from "../middleware/auth.middleware.js";
import { breakdownGoal } from "../services/ai.service.js";

export const aiBreakdown = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { goal } = req.body;
  const result = await breakdownGoal(goal);
  res.json(result);
});
