# FocusFlow

**FocusFlow** turns goals into organized projects and tasks — and includes an **AI Task Breakdown Assistant** that converts a single goal ("Prepare my final web development project") into a concrete, ordered list of tasks you can add with one click.

Built as the NeuroFive Solutions Week 6 Full-Stack Web Development Capstone.

## Problem

Starting a project is often harder than executing it — a broad goal is hard to act on. Most task managers assume you already know your task list; FocusFlow helps you *get* to that list.

## Solution

Projects and tasks are organized with status, priority, and due dates like any task manager — but the AI Breakdown Assistant sits inside the task-creation flow specifically to solve the "I don't know where to start" problem, with a local deterministic fallback so the feature always works even without an AI provider configured.

## Features

- Email/password authentication with JWT (httpOnly cookie), protected routes, per-user data isolation
- Full CRUD for Projects and Tasks, scoped to the authenticated user
- AI Task Breakdown — goal → suggested tasks → Add / Add All
- Dashboard: total/active projects, completed/overdue tasks, today's tasks, priority tasks, progress chart
- Search and filter (by status, priority) on both Projects and Tasks
- Light/dark mode with persisted preference
- Fully responsive (375 / 768 / 1024 / 1440), with a mobile drawer sidebar
- Loading, error, and empty states on every async view
- Custom visual identity ("Focus Signal") — see `web/app/globals.css` for the design tokens

## Tech stack

**Frontend** — Next.js (App Router) · React · TypeScript · Tailwind CSS · React Hook Form · Zod · TanStack Query · Lucide icons · Recharts
**Backend** — Node.js · Express · TypeScript · MongoDB · Mongoose · JWT · argon2 · Zod
**Testing** — Vitest · Supertest · mongodb-memory-server
**Deployment** — Frontend → Vercel · Backend → Render/Railway · Database → MongoDB Atlas

## Architecture

```
Next.js (Vercel)  --HTTPS, JWT cookie-->  Express API (Render/Railway)  --Mongoose-->  MongoDB Atlas
                                                 |
                                                 +-- AI service abstraction (provider + local fallback)
```

- **Frontend**: App Router, `(public)` route group for landing/login/register, `(app)` route group for the authenticated shell (sidebar + topbar), `middleware.ts` redirects unauthenticated users away from protected routes.
- **Backend**: layered — `routes` → `controllers` (thin) → `services` (business logic + authorization) → `models`. Every project/task query is filtered by `req.userId`, never trusted from the URL.

## Database structure

- **User**: name, email (unique), passwordHash, timestamps
- **Project**: userId, name, description, status (Planning/In Progress/Completed/Archived), color, timestamps
- **Task**: projectId, userId, title, description, status (Todo/In Progress/Completed), priority (Low/Medium/High/Urgent), dueDate, timestamps

## API overview

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id

GET    /api/projects/:projectId/tasks
POST   /api/projects/:projectId/tasks

GET    /api/tasks/dashboard
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id

POST   /api/ai/breakdown
```

All routes except `/auth/register`, `/auth/login`, `/auth/logout` require a valid JWT.

## Authentication approach

Register/login hash passwords with **argon2** and issue a JWT stored in an **httpOnly cookie** (7-day expiry — no refresh token, kept simple for this scope). `auth.middleware.ts` verifies the token and attaches `req.userId`; every service function filters by that id, so a user can never reach another user's data by editing an ID in the URL (see `tests/isolation.test.ts`).

## Setup instructions

### Backend
```bash
cd api
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev             # http://localhost:4000
```

### Frontend
```bash
cd web
cp .env.example .env.local
npm install
npm run dev             # http://localhost:3000
```

## Environment variables

**api/.env**
```
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=long-random-string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:3000
AI_PROVIDER_API_KEY=        # optional — falls back to local breakdown logic if empty
```

**web/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Testing

```bash
cd api
npm test        # Vitest + Supertest against an in-memory MongoDB (mongodb-memory-server)
```

Covers registration, login, unauthenticated access, project CRUD, task CRUD, and — critically — **user data isolation** (one user cannot read or delete another user's project/task by guessing its id).

> Note: `npm test` downloads a MongoDB binary on first run. In network-restricted sandboxes this download can fail; it works normally on a regular machine or in CI.

## Deployment

1. Push `api/` and `web/` as two deployables in one GitHub repo (or split into two repos).
2. **MongoDB Atlas** — create a cluster, get the connection string, set it as `MONGODB_URI`.
3. **Backend → Render/Railway** — set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` (your Vercel URL).
4. **Frontend → Vercel** — set `NEXT_PUBLIC_API_URL` to your deployed API URL.
5. Verify in production: register, login, protected routes, project/task CRUD, AI breakdown, search/filter, responsive layout.

## Demo credentials

_Add once seeded, e.g.:_ `demo@focusflow.app` / `password123`

## Challenge + solution

**Challenge**: designing an AI feature that degrades gracefully rather than breaking the app when no provider is configured.
**Solution**: `ai.service.ts` wraps the provider call and always falls back to a deterministic, goal-aware local breakdown if the call fails or no API key is set — the UI shows a small "(offline mode)" label so the behavior is transparent rather than silent.

## Future improvements

- Refresh tokens / session revocation
- Recharts trend view (tasks completed over time)
- Optional GitHub Actions CI and email due-date reminders (stretch goals)
