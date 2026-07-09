# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Arcade Vault — a platform for playing games online and competing for high scores (per README.md, in Spanish). The repo is currently a fresh `create-next-app` scaffold (Next.js 16, React 19, TypeScript, Tailwind v4); no game code has been written yet, so `app/` still contains the default template files.

## Commands

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config via `eslint-config-next`, core-web-vitals + typescript rules)

There is no test runner configured in this repo.

## Architecture

- **App Router only** (`app/` directory) — no `pages/` router. Root layout is `app/layout.tsx`, home route is `app/page.tsx`.
- **Path alias**: `@/*` maps to the repo root (see `tsconfig.json`).
- **Tailwind v4**: configured CSS-first in `app/globals.css` via `@import "tailwindcss"` and `@theme inline` — there is no `tailwind.config.*` file.
- **TypeScript**: `strict` mode is on.
- Since this Next.js version may differ from familiar APIs/conventions, consult `node_modules/next/dist/docs/` before implementing anything App Router-related (see AGENTS.md).

## Spec-driven workflow

This repo develops features through specs rather than ad hoc implementation, using two custom skills pulled from `Klerith/fernando-skills` (tracked in `skills-lock.json`, installed via `npx skills@latest add Klerith/fernando-skills`):

- **`/spec`** — collaboratively designs a spec through clarifying questions, then writes it to `specs/NN-slug.md`. It never writes code, and never marks a spec `Approved` itself (the human does that after re-reading).
- **`/spec-impl NN-slug`** — implements an already-`Approved` spec. It refuses to proceed on any other status (`Draft`, `In review`, `Implemented`, `Obsolete`, in any language). On success it creates/switches to branch `spec-NN-slug` (unless `specs/.spec-config.yml` sets `AutoCreateBranch: false`), then implements the plan one step at a time, pausing for review after each step.

Spec template/state machine lives in `.agents/skills/spec/template.md`. Valid statuses: `Draft` → `In review` → `Approved` → `Implemented` (or `Obsolete`). There is no `specs/` directory yet — the first `/spec` run will create it.
