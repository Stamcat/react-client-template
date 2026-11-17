# react-client-template

A base project template for React client applications, pre-wired with the code-quality tooling
and AI coding-agent instructions a project needs from day one. A one-time `postinstall` setup
(see "Getting started" below) lets you pick the application architecture, styling approach,
design system, and state-management approach for your project, then scaffolds only what you
chose — so the result is never a one-size-fits-all template, and both the code and the AI
instructions can mature as the app is built out.

## What's included

- **Architecture** (chosen at setup): React (Vite SPA) with `react-router-dom` routing (see
  [routing](.github/skills/routing/SKILL.md)) and an optional `vite-plugin-prerender` build step
  for crawler-visible static HTML; Next.js (Pages Router); or React Server Components (Next.js App
  Router). Each scaffolds only the files and dependencies that architecture needs.
- **Styling** (chosen at setup): SCSS Modules, CSS Modules, Tailwind CSS, Emotion (Vite SPA and
  Pages Router only — CSS-in-JS doesn't play well with RSC server rendering), or none. See
  [styling](.github/skills/styling/SKILL.md).
- **Design system** (optional, chosen at setup): `@stamcat/craftsman`, `@stamcat/chadman`, or none.
- **State management** (chosen at setup): Redux Toolkit + redux-saga, Redux Toolkit + thunk, or
  none, wired through `src/redux/index.ts` when selected. See
  [state-management](.github/skills/state-management/SKILL.md).
- **Build/dev tooling**: TypeScript (project references); Vite + `@vitejs/plugin-react-swc` for the
  SPA architecture, or Next.js for the other two.
- **Validation**: Zod, for schemas at data boundaries (see
  [data-validation](.github/skills/data-validation/SKILL.md)).
- **Code quality**: ESLint (`typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`,
  `eslint-plugin-sonarjs`, Prettier integration), Prettier, dependency-cruiser (import-boundary
  rules), `npm-package-json-lint`, commitlint, EditorConfig.
- **Testing**: Jest + `ts-jest` + `jsdom` for unit tests (see
  [unit-testing](.github/skills/unit-testing/SKILL.md)), Playwright for end-to-end tests (see
  [playwright-testing](.github/skills/playwright-testing/SKILL.md)). Run `npx playwright install`
  once before the first `npm run test:e2e`.
- **AI instructions**: [`AGENTS.md`](AGENTS.md) is the single source of truth for app standards,
  read by GitHub Copilot, Claude, Gemini, Grok, GPT, and Cursor — GitHub Copilot, Claude, Gemini,
  and Cursor via pointer files (`.github/copilot-instructions.md`, `CLAUDE.md`, `GEMINI.md`,
  `.cursor/rules/app-standards.mdc`), Grok and GPT by reading `AGENTS.md` directly. Detailed,
  topic-specific conventions live under [`.github/skills/`](.github/skills/) and grow as the app
  does — see the "App Standards Skills" section of `AGENTS.md` for the index and the enforcement
  summary for which rules are machine-checked today.


## Getting started

```sh
npm install
npm install
npm run dev
```

The first `npm install` runs this template's one-time `postinstall` script, which sets
`package.json`'s (and `package-lock.json`'s) `name` to your project's folder name, updates the
title lines in this README, `AGENTS.md`, and `.github/copilot-instructions.md` to match, then
prompts for an application architecture (React Vite SPA, Next.js Pages Router, or React Server
Components via Next.js App Router) — choosing the React Vite SPA then asks whether to add
`vite-plugin-prerender`, which prerenders static HTML per route at build time so crawlers that
don't execute JS still see real content — a styling approach (SCSS Modules, CSS Modules, Tailwind
CSS, Emotion, or none), an optional design system (`@stamcat/craftsman`, `@stamcat/chadman`, or
none), and a state-management approach (Redux Toolkit + redux-saga, Redux Toolkit + thunk, or
none). Each choice
adds or removes dependencies in `package.json` and scaffolds only the chosen files, but doesn't
install anything — **the second `npm install` is required** to actually install the
newly-added/removed dependencies before `npm run dev` will work.

This setup only runs once — the `scripts/postinstall/` scripts delete themselves after the first
run, so every `npm install` after that is a normal install with no prompts.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server (Vite, or `next dev` depending on the chosen architecture) |
| `npm run build` | Type-check and build for production |
| `npm run lint` | ESLint + dependency-cruiser + package.json lint |
| `npm run lint:fix` | ESLint with autofix |
| `npm run type-check` | `tsc --noEmit` |
| `npm run test` | Run Jest |
| `npm run test:coverage` | Run Jest with coverage |
| `npm run test:e2e` | Run Playwright end-to-end specs |
| `npm run test:e2e:ui` | Run Playwright specs in interactive UI mode |
| `npm run pretty` | Format `src/**/*` with Prettier |

## Growing this template

When a new cross-cutting convention emerges as the app matures (a new data-fetching pattern, a
testing convention, a performance budget, a boundary around a newly-introduced legacy area), add a
new skill folder under `.github/skills/`, link it from the table in `AGENTS.md`, and — where it's
genuinely machine-checkable — add the enforcing rule to `eslint.config.js` and/or
`scripts/.dependency-cruiser-check.cjs` and record it in the enforcement summary.
