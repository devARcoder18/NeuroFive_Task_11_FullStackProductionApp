import { describe, it, expect } from "vitest";
import request from "supertest";
import "./setup.js";
import { app } from "../src/app.js";
import { registerAndLogin } from "./helpers.js";

describe("User data isolation", () => {
  it("prevents one user from reading another user's project by guessing its id", async () => {
    const owner = await registerAndLogin("owner@example.com");
    const attacker = await registerAndLogin("attacker@example.com");

    const created = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${owner.token}`)
      .send({ name: "Private Project" });

    const res = await request(app)
      .get(`/api/projects/${created.body.project._id}`)
      .set("Authorization", `Bearer ${attacker.token}`);

    expect(res.status).toBe(404);
  });

  it("prevents one user from deleting another user's task by id", async () => {
    const owner = await registerAndLogin("owner2@example.com");
    const attacker = await registerAndLogin("attacker2@example.com");

    const project = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${owner.token}`)
      .send({ name: "Owner Project" });

    const task = await request(app)
      .post(`/api/projects/${project.body.project._id}/tasks`)
      .set("Authorization", `Bearer ${owner.token}`)
      .send({ title: "Owner Task" });

    const res = await request(app)
      .delete(`/api/tasks/${task.body.task._id}`)
      .set("Authorization", `Bearer ${attacker.token}`);

    expect(res.status).toBe(404);
  });
});
