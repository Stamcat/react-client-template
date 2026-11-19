# react-client-template

Source repo for the `create-react-client-app` CLI (`packages/create-app/`) and its layered
templates (`templates/`): a project generator that lets you pick the application architecture,
styling approach, design system, and state-management approach for a new React client project,
then scaffolds only what you chose — so the result is never a one-size-fits-all template, and
both the generated code and its AI instructions can mature as the app is built out.

The repo root itself is also a working checkout of the default combination (Vite SPA, no styling,
Redux Toolkit + redux-saga, no design system) — pre-wired with the same code-quality tooling and
AI coding-agent instructions described below — used to develop and validate the template system
against a real app. See "Getting started" for running this checkout directly versus generating a
new project with the CLI.

## What's included

- **Architecture** (chosen when generating a project): React (Vite SPA) with `react-router-dom` routing (see
  [routing](.github/skills/routing/SKILL.md)) and an optional `vite-plugin-prerender` build step
  for crawler-visible static HTML; Next.js (Pages Router); or React Server Components (Next.js App
  Router). Each scaffolds only the files and dependencies that architecture needs.
- **Styling** (chosen when generating a project): SCSS Modules, CSS Modules, Tailwind CSS, Emotion
  (Vite SPA and Pages Router only), or none. See
  [styling](.github/skills/styling/SKILL.md).
- **Design system** (optional, chosen when generating a project): `@stamcat/craftsman`,
  `@stamcat/chadman`, or none.
- **State management** (chosen when generating a project): Redux Toolkit + redux-saga, Redux
  Toolkit + thunk, or none, wired through `src/utils/store.ts` when selected. See
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

To generate a new project with the CLI (choosing architecture, styling, design system, and
state-management interactively), clone this repo and run the generator directly — it has no
dependencies of its own, so no `npm install` is needed at this repo's root first:

```sh
git clone https://github.com/Stamcat/react-client-template.git
cd react-client-template
node packages/create-app/bin/create.js my-new-app
cd my-new-app && npm install && npm run dev
```

To run this repo's own checkout directly (the default Vite/no-styling/redux-saga combination,
used for developing and validating the template system itself):

```sh
npm install
npm run dev
```

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
