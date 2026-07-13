# SPEC 01 — Arcade Vault visual MVP (5 screens)

> **Status:** Implemented
> **Depends on:** none
> **Date:** 2026-07-09
> **Objective:** Port the five reference-template screens (library, game detail, game player, leaderboard, login) into fully navigable Next.js App Router pages with the original retro-arcade visual design, mock data, and localStorage-backed session/score state — no real game logic yet.

## Scope

**In:**

- Five routes under `app/`: `/` (library), `/games/[id]` (detail), `/games/[id]/play` (player), `/leaderboard` (hall of fame), `/login` (auth).
- Shared layout (`app/layout.tsx`): Nav (desktop links + mobile slide-out panel), footer, and the decorative background layers (perspective grid/scanlines + noise overlay).
- Porting `styles.css` almost verbatim into its own stylesheet imported by the layout, alongside the existing Tailwind setup (Tailwind config untouched).
- Fonts (Press Start 2P, JetBrains Mono, Courier Prime) loaded via `next/font/google` instead of the template's `<link>` tags.
- Mock data (`GAMES`, `CATS`, `PLAYERS`, `seededScores`) ported into a typed module under `lib/`.
- Client-side session/score state persisted to `localStorage` under the original keys (`av_user`, `av_scores`).
- Library: search box, category chips, tilt-on-hover game grid.
- Game detail: cover, tags, description, stat strip, mocked leaderboard sidebar, CTA into the player.
- Game player: HUD (score/lives/level), simulated score ticker, pause, end game, game-over modal with save-score flow, CRT frame with a generic placeholder arena animation (identical for every game id).
- Leaderboard: per-game tabs, top-3 podium, ranked table, "your score" row when logged in.
- Login: sign-in/sign-up tabs, guest button, decorative (non-functional) social buttons, fake login that accepts any input.
- All UI copy translated to English.
- Responsive behavior at the breakpoints already defined in `styles.css` (840px nav, 900px detail grid, 720px leaderboard/table).

**Out of scope (for future specs):**

- Real game mechanics for any of the 8 games in the mock data.
- Real authentication/backend, real OAuth for the Google/GitHub buttons.
- Real leaderboard backend — all scores stay seeded/mocked except the one score a player saves locally.
- A real "credits" system — the nav coin counter stays static decorative text.
- Game cover art as images/sprites — covers stay pure-CSS generated backgrounds, as in the template.
- SEO/metadata polish or an accessibility audit beyond what the template already provides.
- Automated tests (none are configured in this repo).
- Rewriting the design system as Tailwind utilities — decided to port `styles.css` almost verbatim instead.

## Data model

```ts
// lib/games.ts
export type GameCategory = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";

export type Game = {
  id: string;            // slug, e.g. "brick-buster" — used in /games/[id] and /games/[id]/play
  title: string;
  short: string;         // one-line description (library card)
  long: string;          // paragraph description (detail screen)
  cat: GameCategory;
  cover: string;         // CSS class selecting the pure-CSS cover background, e.g. "cover-bricks"
  color: "cyan" | "magenta" | "yellow" | "green";
  best: number;          // mocked global best score
  plays: string;         // mocked play count, e.g. "12.4K"
};

export const GAMES: Game[];
export const CATS: ["ALL", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"];
export const PLAYERS: string[]; // mocked handles used to seed leaderboard rows

export type ScoreRow = { rank: number; name: string; score: number; date: string };
export function seededScores(seed: number, count?: number): ScoreRow[]; // deterministic pseudo-random rows

// Session (localStorage key "av_user")
export type Session = { name: string } | null;

// Saved score (localStorage key "av_scores", array appended to on save)
export type SavedScoreEntry = { game: string; score: number; name: string; at: number };
```

Conventions:

- `Game.id` is the single identifier shared by both `/games/[id]` and `/games/[id]/play` dynamic routes.
- `seededScores` must stay a pure function of `(seed, count)` so the same game always renders the same mocked leaderboard on every load.
- `localStorage` keys are unchanged from the template (`av_user`, `av_scores`) even though everything else is translated to English.

## Implementation plan

1. Add `lib/games.ts` with `GAMES`, `CATS`, `PLAYERS`, `seededScores`, and the `Game`/`ScoreRow` types (ported from `data.jsx`, category labels and copy translated to English).
2. Add `app/arcade.css` (styles.css ported, class names kept, copy/comments translated where present) and wire it + `next/font/google` (Press Start 2P, JetBrains Mono, Courier Prime) into `app/layout.tsx`, replacing the default scaffold styling. Add the `.av-bg` / `.av-noise` background layers and an empty `<main>`. Manual test: `/` renders the dark neon background/scanlines with no page content yet.
3. Build `components/Nav.tsx` (desktop links, mobile slide-out panel, coin counter, auth button reading session from a `useSession` localStorage hook) and mount it + a static footer in `app/layout.tsx`. Manual test: nav renders on every route, mobile hamburger opens/closes the panel.
4. Build `app/page.tsx` (Library): hero, search input, category chips, game grid with tilt-on-hover `GameCard`, linking each card to `/games/[id]`. Manual test: typing in search and clicking chips filters the grid; "no results" state shows.
5. Build `app/games/[id]/page.tsx` (Game detail): cover, tags, stat strip, description, `seededScores`-driven leaderboard sidebar, CTA buttons to `/games/[id]/play` and back to `/`. Manual test: visiting any valid game id renders its own cover/copy/stats.
6. Build `app/games/[id]/play/page.tsx` (Game player): HUD, CRT frame with the generic placeholder arena animation, simulated score ticker, pause/end controls, game-over modal with the save-score form writing to `av_scores` in localStorage. Manual test: score climbs automatically, pause freezes it, ending the game opens the modal and saving persists an entry (check via devtools localStorage).
7. Build `app/leaderboard/page.tsx` (Hall of Fame): per-game tabs, top-3 podium, ranked table, "your score" row shown only when a session exists. Manual test: switching tabs reseeds the table; logging in surfaces the "your score" row.
8. Build `app/login/page.tsx` (Auth): sign-in/sign-up tabs, form fields, guest button, decorative social buttons, wiring `onLogin` to store `av_user` and redirect to `/`. Manual test: submitting any credentials or clicking guest logs in, Nav auth button reflects the session, sign-out clears it.
9. Final pass: remove leftover `create-next-app` boilerplate (default `app/page.tsx` content, unused default styles), verify every in-app link/navigation path, and check the three responsive breakpoints (840px, 900px, 720px) on each screen.

## Acceptance criteria

- [ ] `/` renders the library with hero, search box, category chips, and the full game grid.
- [ ] Typing in the search box filters the grid by title; selecting a category chip filters by category; combining both works together.
- [ ] Filtering to no matches shows the "no results" empty state.
- [ ] Clicking a game card or its "PLAY" button navigates to `/games/[id]` for that game.
- [ ] `/games/[id]` shows that game's cover, tags, description, stat strip, and a mocked leaderboard sidebar with 10 rows.
- [ ] Visiting `/games/[id]` for an unknown id does not crash the app.
- [ ] Clicking "PLAY NOW" on the detail screen navigates to `/games/[id]/play`.
- [ ] On `/games/[id]/play`, the score increases automatically without user input.
- [ ] Clicking "PAUSE" stops the score from increasing and the button label changes to "RESUME"; clicking again resumes.
- [ ] Clicking "END" opens the game-over modal showing the final score.
- [ ] Submitting the save-score form in the modal writes an entry to the `av_scores` key in localStorage and shows the "saved" confirmation.
- [ ] Clicking "PLAY AGAIN" resets score/lives/level and closes the modal; clicking "BACK TO VAULT" returns to `/`.
- [ ] `/leaderboard` renders tabs for every game; switching tabs updates the podium and table.
- [ ] The podium shows exactly the top 3 rows; the table below shows the full ranked list.
- [ ] When logged in, `/leaderboard` shows an additional "your score" row for the active game tab; when logged out, it does not.
- [ ] `/login` lets the user submit any username/password and becomes logged in (Nav shows the username instead of "Sign In"), then redirects to `/`.
- [ ] Clicking "PLAY AS GUEST" on `/login` logs in without requiring any input and redirects to `/`.
- [ ] Clicking the Nav auth button while logged in signs the user out (Nav reverts to "Sign In").
- [ ] Reloading the page after logging in keeps the session (reads `av_user` from localStorage).
- [ ] Reloading the page after saving a score keeps the saved entry (reads `av_scores` from localStorage).
- [ ] The mobile nav hamburger (viewport ≤ 840px) opens a slide-out panel with the same links as desktop.
- [ ] No console errors appear when navigating through all five routes in sequence.

## Decisions

- **Yes:** real App Router routes (`/`, `/games/[id]`, `/games/[id]/play`, `/leaderboard`, `/login`) instead of the template's hash-based single-page router. Idiomatic for Next.js, gives shareable URLs, matches AGENTS.md/CLAUDE.md guidance to follow this Next.js version's own conventions.
- **No:** keeping the hash-based JSON router. Would fight the App Router instead of using it.
- **Yes:** English for routes, file/component names, and all UI copy. User's explicit call, overriding the template's Spanish.
- **Yes:** keep the game player's simulated score loop, pause, and game-over/save-score flow. It's the intended placeholder experience for an MVP demo before real games exist, not dead code to strip.
- **Yes:** keep `localStorage` for session (`av_user`) and saved scores (`av_scores`), same keys as the template. No backend yet; this is enough for an MVP and avoids inventing new persistence just for this spec.
- **Yes:** port `styles.css` almost verbatim as its own stylesheet, kept alongside Tailwind, instead of translating the design system into Tailwind utilities/`@theme` tokens. Preserves visual fidelity to the template exactly; a full Tailwind translation is a bigger, riskier effort better suited to its own spec if ever wanted.
- **Yes:** load fonts via `next/font/google` instead of the template's Google Fonts `<link>` tags. Standard Next.js practice, avoids a render-blocking external request.
- **Yes:** all 8 games share one generic placeholder arena animation on the player screen, matching the template. No per-game visuals exist yet since no game logic is in scope.
- **No:** a real "credits" system for the nav coin counter. Stays static decorative text, same as the template — out of scope for a visual-only MVP.

## Risks

| Risk                                                                 | Mitigation                                                                                             |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Tailwind's Preflight reset (already active via `globals.css`) collides with the ported plain CSS (button/input resets, `box-sizing`, margins) | Load `arcade.css` after Tailwind's base layer and re-check the buttons/inputs/nav visually against the template after wiring the layout. |
| Reading `localStorage` during server render throws in the App Router | Keep session/score reads inside client components, only accessed in `useEffect`/event handlers, same pattern the template already uses. |
| Route-per-screen split changes how state travels between screens (e.g. player→leaderboard "your score") compared to the template's single in-memory `App` component | Recompute anything screen-local (`route`-scoped state) per page; only session and saved scores need to cross routes, and both already live in `localStorage`. |

## What is **not** in this spec

- Real game mechanics for any of the 8 games (Brick Buster, Tetro, Snake, Pac-style Glutton, Invaders, Asteroids, Frogger, Pixel Duel).
- Real authentication, real backend, real OAuth for Google/GitHub.
- A real leaderboard backend — all rows besides the one locally-saved score stay seeded/mocked.
- A real credits/currency system.
- Real cover art, sprites, or game assets — covers stay pure-CSS.
- SEO/metadata work or an accessibility audit.
- Automated tests.
- A Tailwind-utility rewrite of the design system.

Each one of those, if it lands, goes in its own spec.
