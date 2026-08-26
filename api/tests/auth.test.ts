import { describe, it, expect } from "vitest";
import request from "supertest";
import "./setup.js";
import { app } from "../src/app.js";

describe("Auth", () => {
  it("registers a new user and returns a token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Abdur Razzaq",
      email: "abdur@example.com",
      password: "password123",
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("abdur@example.com");
  });

  it("rejects registration with an existing email", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Abdur",
      email: "dupe@example.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/register").send({
      name: "Someone Else",
      email: "dupe@example.com",
      password: "password123",
    });
    expect(res.status).toBe(409);
  });

  it("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "login@example.com",
      password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "password123",
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects an unauthenticated request to /me", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
