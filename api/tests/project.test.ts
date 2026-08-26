import { describe, it, expect } from "vitest";
import request from "supertest";
import "./setup.js";
import { app } from "../src/app.js";
import { registerAndLogin } from "./helpers.js";

describe("Projects", () => {
  it("creates a project for the authenticated user", async () => {
    const { token } = await registerAndLogin();
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Final Web Project" });

    expect(res.status).toBe(201);
    expect(res.body.project.name).toBe("Final Web Project");
    expect(res.body.project.status).toBe("Planning");
  });

  it("lists only the current user's projects", async () => {
    const { token } = await registerAndLogin();
    await request(app).post("/api/projects").set("Authorization", `Bearer ${token}`).send({ name: "A" });
    await request(app).post("/api/projects").set("Authorization", `Bearer ${token}`).send({ name: "B" });

    const res = await request(app).get("/api/projects").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.projects).toHaveLength(2);
  });

  it("updates a project", async () => {
    const { token } = await registerAndLogin();
    const created = await request(app).post("/api/projects").set("Authorization", `Bearer ${token}`).send({ name: "Old" });
    const res = await request(app)
      .put(`/api/projects/${created.body.project._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "Completed" });

    expect(res.status).toBe(200);
    expect(res.body.project.status).toBe("Completed");
  });
});
