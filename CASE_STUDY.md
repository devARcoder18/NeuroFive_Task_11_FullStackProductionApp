# FocusFlow — Case Study

## Problem
Task managers are good at tracking work once you know what the work is. The harder moment is earlier: turning a vague goal ("prepare my final project") into a first concrete step. That gap is where most people stall.

## Solution
FocusFlow keeps the core of a task manager — projects, tasks, status, priority, due dates — deliberately simple, and puts effort into the one moment that's actually hard: the **AI Task Breakdown Assistant**. A user types a goal, and it returns a short, ordered list of concrete tasks they can add individually or all at once, directly into the project they're working in.

## Technology choices
- **Next.js/React/TypeScript** — file-based routing fits the small, fixed page set well; TypeScript catches the kind of mismatch bugs that are easy to introduce when frontend and backend evolve independently.
- **Express/MongoDB/Mongoose** — a document per Project/Task maps naturally to the domain, and Mongoose schemas give lightweight validation at the model layer to back up Zod.
- **JWT in an httpOnly cookie** — avoids exposing the token to client-side JS (XSS-resistant) while staying simple enough not to need refresh-token infrastructure at this scale.
- **Zod on both ends** — one schema shape mirrored on frontend and backend means validation logic doesn't drift between the two.

## Challenge
The AI Breakdown feature is the differentiator, but it can't be a single point of failure — if the AI API is down, slow, or simply not configured (e.g., in a grader's environment with no API key), the feature still needs to work.

## Solution
`ai.service.ts` separates "ask a provider" from "the feature." It always attempts the configured provider first; if that call fails, times out, or no API key is set, it falls back to a deterministic, goal-aware breakdown generated locally — same shape of response, same UI, with a small "(offline mode)" label so the behavior is honest rather than hidden.

## Result
A small, focused full-stack app (5 pages, 2 core resources, 1 AI feature) that satisfies every required MVP item — auth, CRUD, protected routes, validation, dashboard, dark mode, search/filter, tests — without expanding scope beyond what a Week 6 capstone needs, while still having one clearly differentiated, portfolio-worthy feature and a visual identity that isn't a template default.
