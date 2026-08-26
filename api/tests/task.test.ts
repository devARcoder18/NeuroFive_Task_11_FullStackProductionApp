import { describe, it, expect } from "vitest";
import request from "supertest";
import "./setup.js";
import { app } from "../src/app.js";
import { registerAndLogin } from "./helpers.js";

async function createProject(token: string) {
  const res = await request(app).post("/api/projects").set("Authorization", `Bearer ${token}`).send({ name: "Capstone" });
  return res.body.project._id as string;
}

describe("Tasks", () => {
  it("creates a task inside a project", async () => {
    const { token } = await registerAndLogin();
    const projectId = await createProject(token);

    const res = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Design database", priority: "High" });

    expect(res.status).toBe(201);
    expect(res.body.task.title).toBe("Design database");
    expect(res.body.task.priority).toBe("High");
  });

  it("updates a task's status", async () => {
    const { token } = await registerAndLogin();
    const projectId = await createProject(token);
    const created = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Write tests" });

    const res = await request(app)
      .put(`/api/tasks/${created.body.task._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "Completed" });

    expect(res.status).toBe(200);
    expect(res.body.task.status).toBe("Completed");
  });

  it("deletes a task", async () => {
    const { token } = await registerAndLogin();
    const projectId = await createProject(token);
    const created = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Temp task" });

    const res = await request(app).delete(`/api/tasks/${created.body.task._id}`).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  it("rejects task creation on a nonexistent project", async () => {
    const { token } = await registerAndLogin();
    const res = await request(app)
      .post("/api/projects/64b000000000000000000000/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Ghost task" });
    expect(res.status).toBe(404);
  });
});
