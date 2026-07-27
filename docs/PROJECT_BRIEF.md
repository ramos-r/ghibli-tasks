# Ghibli Tasks — Project Brief & Decision Log

This document consolidates the original engineering README with every decision made
during the planning conversation. Treat it as the single source of truth alongside
`README_FOR_CLAUDE`, and keep it updated as new decisions are made.

---

## 1. Project Overview

A production-quality, portfolio-grade full-stack task management app with a
Studio Ghibli–inspired visual identity: calm, cozy, minimal, elegant — never childish.

## 2. Tech Stack

| Layer           | Choice                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| Frontend        | Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Lucide React                                     |
| Backend         | Next.js API Routes, Server Actions where appropriate                                                               |
| Database        | PostgreSQL via Prisma ORM                                                                                          |
| Auth            | Better Auth — **email/password only for v1**. Google OAuth planned as a later addition, not part of initial scope. |
| Hosting         | Vercel (app) + Neon (Postgres)                                                                                     |
| Package manager | npm                                                                                                                |
| Lint / Format   | ESLint / Prettier                                                                                                  |
| Testing         | **Added to scope:** Vitest + React Testing Library (unit/component), Playwright (e2e) — set up starting in Phase 1 |

## 3. Architecture Rules

- **Feature-based architecture** — never dump everything into `components/`.
- Standard structure:
  ```
  src/
    app/
    components/features/
    hooks/
    lib/
    services/
    types/
    utils/
    styles/
  prisma/
  public/
  ```
- Business logic never lives inside UI components — it belongs in `services/` or `lib/`.
- Pages stay lightweight: composition only, no direct DB access, no duplicated layouts.
- SOLID, Clean Code, DRY, KISS. No giant files. No unnecessary state.
- TypeScript: never `any`; strict typing, interfaces/types/generics preferred.
- Styling: Tailwind only, no inline styles, no CSS Modules unless unavoidable.
- Mobile-first, accessible (aria-labels, semantic HTML, keyboard nav, focus states, contrast).
- Prefer Server Components, lazy loading, image optimization, code splitting.
- Standardized API response shape: `{ success, message, data, error }`. Never leak internal errors to the client.
- Zod validation on all forms, API input, and DB input. Never trust client data.
- Prisma migrations only — never hand-edit the database.

## 4. Design System (Pending Final Input)

Token names are defined conceptually in the README (Forest Green, Warm Cream, Soft Green,
Warm Brown, Light Beige, Muted Olive, Moss Green, Warm Amber, Soft Red, Dark Olive),
but **exact hex values and visual references are still to be provided by the user**
before Phase 2 begins. Do not invent final production hex values without that input —
confirm them explicitly when supplied.

Style rules once tokens are set: soft shadows only, rounded corners everywhere (buttons,
cards, inputs, dialogs), subtle animations only (fade/slide/scale/hover, 150–300ms),
generous white space, never overwhelming.

## 5. Decisions Made During Planning

1. **Execution environment:** Planning and architecture decisions happen in this
   conversation; actual implementation (`npm install`, live Neon connection, running
   migrations, git/GitHub operations, Vercel deploys) happens in Claude Code, which has
   real terminal and network access.
2. **Neon Postgres:** Manually set up by the user via the Neon console (`neon.tech`).
   Project created with a chosen region (closest available AWS region — no São Paulo
   region currently exists on Neon), a Postgres version, and a database name. Two
   connection strings obtained: **pooled** (`-pooler` host, used as runtime `DATABASE_URL`)
   and **unpooled** (direct host, used as `DIRECT_URL` for Prisma migrations).
3. **GitHub:** User will create the repository themselves — no walkthrough needed.
4. **Phase 1 vs. Phase 5 migration overlap:** Phase 1's "first migration" is a minimal/
   placeholder Prisma schema only, to confirm tooling and DB connectivity. The real data
   model (User, Task, Category, Tag, Subtask, Reminder, Attachment) is built properly in
   Phase 4 (User, for auth) and Phase 5 (the rest).
5. **Design tokens:** User will supply exact hex values and reference images before
   Phase 2 starts. Do not finalize the palette without them.
6. **Authentication scope:** Email/password only for v1. Google (or other OAuth)
   is a explicitly deferred, later addition — not part of Phase 4's initial scope.
7. **Testing:** Automated testing is in scope from the start (not deferred). Vitest +
   React Testing Library for unit/component tests, Playwright for e2e, set up as part
   of Phase 1's foundational tooling.

## 6. Development Workflow (per feature)

1. Analyze the requested feature.
2. Check for reusable existing components.
3. Create new reusable components first, if needed.
4. Update the DB schema if necessary.
5. Update Prisma migrations.
6. Build backend logic.
7. Create API endpoints / Server Actions.
8. Validate with Zod.
9. Build the frontend UI.
10. Connect frontend ↔ backend.
11. Handle loading, empty, and error states.
12. Make it responsive.
13. Test manually **and** with automated tests (unit/component + e2e where relevant).
14. Refactor duplicated code.
15. Update documentation if needed.

Never skip a step. Never anticipate roadmap phases ahead of schedule. Never introduce
unnecessary dependencies. Always explain architectural decisions before large changes.

## 7. Roadmap (16 Phases)

1. Project Foundation — _in progress, plan finalized below_
2. Design System
3. Layout
4. Authentication (email/password only)
5. Database Models
6. Task Management (core CRUD + search/filter/sort)
7. Categories
8. Tags
9. Subtasks
10. Calendar
11. Dashboard
12. Notifications
13. Search
14. Settings
15. Polish (loading states, empty states, animations, error pages, a11y/perf pass)
16. Deployment

**Deferred / future features (do not build now, but keep architecture open to them):**
recurring tasks, Pomodoro timer, habit tracker, notes/markdown editor, file attachments,
Google Calendar sync, Discord notifications, email reminders, AI task suggestions, dark
mode, offline mode (PWA), multi-language support, team collaboration, shared task lists.

## 8. Phase 1 — Finalized Execution Plan

1. Initialize Next.js (App Router, TypeScript, ESLint).
2. Configure Tailwind CSS.
3. Install & configure shadcn/ui (base setup only).
4. Configure ESLint (strict, no `any`) + Prettier, integrated without conflicts.
5. Configure path aliases (`@/components`, `@/services`, `@/lib`, `@/hooks`, `@/types`).
6. Create `.env.example` + Zod-validated env loader (`lib/env.ts`) covering `DATABASE_URL`
   and `DIRECT_URL`.
7. Build the feature-based folder skeleton per the README.
8. Initialize Prisma with a minimal placeholder schema, configured for Neon's pooled +
   unpooled connection strings.
9. Set up Vitest + React Testing Library and Playwright, with one example test each and
   `npm run test` / `npm run test:e2e` scripts.
10. `.gitignore` tuned for Next.js/Prisma/env files; first commit using `feat:` convention.
11. Confirm the structure is Vercel-deploy-ready (no actual deploy yet).

**Deliverable:** a complete, installable project skeleton — buildable once `npm install`
is run — DB-connection-ready and test-tooling-ready, with no business logic yet.

## 9. Design/Colors

background: #F4ECD9;

primary: #ADBD88;

primary-hover: #96A677;

secondary: #CFD1AF;

surface: #F8F3E8;

border: #D8D7C3;

text: #5A664B;

text-secondary: #7A8268;

accent: #B3C190;

success: #8BAA6A;

warning: #D6B36A;

danger: #C97A73;
