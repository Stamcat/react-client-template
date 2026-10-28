# react-client-template

A base project template for React client applications: a Vite + React + TypeScript app
pre-wired with the code-quality tooling and AI coding-agent instructions a project needs from
day one, structured so both can mature as the app is built out.

## What's included

- **Build/dev tooling**: Vite, TypeScript (project references), `@vitejs/plugin-react-swc`.
- **State management**: Redux Toolkit + redux-saga, wired through `src/redux/index.ts`.
- **Validation**: Zod, for schemas at data boundaries (see
  [data-validation](.github/skills/data-validation/SKILL.md)).
- **Routing**: `react-router-dom` (see [routing](.github/skills/routing/SKILL.md)).
- **Code quality**: ESLint (`typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`,
  `eslint-plugin-sonarjs`, Prettier integration), Prettier, dependency-cruiser (import-boundary
  rules), `npm-package-json-lint`, commitlint, EditorConfig.
- **Testing**: Jest + `ts-jest` + `jsdom`.
- **AI instructions**: [`AGENTS.md`](AGENTS.md) is the single source of truth for app standards,
  read by GitHub Copilot, Claude, and Cursor via pointer files
  (`.github/copilot-instructions.md`, `CLAUDE.md`, `.cursor/rules/app-standards.mdc`). Detailed,
  topic-specific conventions live under [`.github/skills/`](.github/skills/) and grow as the app
  does — see the "App Standards Skills" section of `AGENTS.md` for the index and the enforcement
  summary for which rules are machine-checked today.

## Getting started

```sh
npm install
npm run dev
```

`npm install` also sets `package.json`'s `name` to your project's folder name (via the
`postinstall` script), so a copy of this template picks up the new app's name instead of staying
`react-client-template`. It only runs once — it no-ops once `name` is no longer the template
default.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | ESLint + dependency-cruiser + package.json lint |
| `npm run lint:fix` | ESLint with autofix |
| `npm run type-check` | `tsc --noEmit` |
| `npm run test` | Run Jest |
| `npm run test:coverage` | Run Jest with coverage |
| `npm run pretty` | Format `src/**/*` with Prettier |

## Growing this template

When a new cross-cutting convention emerges as the app matures (a new data-fetching pattern, a
testing convention, a performance budget, a boundary around a newly-introduced legacy area), add a
new skill folder under `.github/skills/`, link it from the table in `AGENTS.md`, and — where it's
genuinely machine-checkable — add the enforcing rule to `eslint.config.js` and/or
`scripts/.dependency-cruiser-check.cjs` and record it in the enforcement summary.
