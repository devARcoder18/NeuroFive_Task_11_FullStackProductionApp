import { Router } from "express";
import { aiBreakdown } from "../controllers/ai.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { aiBreakdownSchema } from "../validators/task.validator.js";

const router = Router();
router.use(authMiddleware);
router.post("/breakdown", validateBody(aiBreakdownSchema), aiBreakdown);

export default router;
