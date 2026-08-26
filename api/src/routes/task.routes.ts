import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { updateTaskSchema } from "../validators/task.validator.js";

const router = Router();
router.use(authMiddleware);

router.get("/dashboard", taskController.getDashboard);
router.get("/:id", taskController.getTask);
router.put("/:id", validateBody(updateTaskSchema), taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
