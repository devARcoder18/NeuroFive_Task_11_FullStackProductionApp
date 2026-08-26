import { Router } from "express";
import * as projectController from "../controllers/project.controller.js";
import * as taskController from "../controllers/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validator.js";
import { createTaskSchema } from "../validators/task.validator.js";

const router = Router();
router.use(authMiddleware);

router.get("/", projectController.listProjects);
router.post("/", validateBody(createProjectSchema), projectController.createProject);
router.get("/:id", projectController.getProject);
router.put("/:id", validateBody(updateProjectSchema), projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

router.get("/:projectId/tasks", taskController.listTasks);
router.post("/:projectId/tasks", validateBody(createTaskSchema), taskController.createTask);

export default router;
