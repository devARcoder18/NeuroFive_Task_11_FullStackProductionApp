import request from "supertest";
import { app } from "../src/app.js";

export async function registerAndLogin(email = "user@example.com") {
  const res = await request(app).post("/api/auth/register").send({
    name: "Test User",
    email,
    password: "password123",
  });
  return { token: res.body.token as string, userId: res.body.user.id as string };
}
