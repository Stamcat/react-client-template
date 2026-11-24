# @stamcat/create-react-client-app

Project generator for [react-client-template](https://github.com/Stamcat/react-client-template):
pick the application architecture, styling approach, state-management approach, and design
system for a new React client project, then scaffolds only what you chose.

## Usage

```sh
npx @stamcat/create-react-client-app my-new-app
cd my-new-app && npm run dev
```

Or via npm's scoped-package `create` convenience:

```sh
npm create @stamcat/react-client-app my-new-app
```

If `my-new-app` is omitted, you're prompted for a project name. The target directory must not
already exist or must be empty.

## What you're prompted for

- **Architecture**: React (Vite SPA), Next.js (Pages Router), or React Server Components
  (Next.js App Router).
- **Styling**: SCSS Modules, CSS Modules, Tailwind CSS, Emotion (Vite SPA only), or none.
- **State management**: Redux Toolkit + redux-saga, Redux Toolkit + thunk, or none.
- **Design system**: `@stamcat/craftsman`, `@stamcat/chadman`, or none (default).

Options not yet implemented for the architecture you picked are shown as "(coming soon)" and
re-prompt if chosen. `npm install` runs automatically in the generated project once every choice
is made.

## Flags

| Flag | Effect |
| --- | --- |
| `--skip-install` | Scaffold the project but don't run `npm install` |
| `--yes` | Accept the default answer for every remaining prompt instead of asking interactively |

## Non-interactive generation

Set any of these environment variables to skip the corresponding prompt — useful for scripting
or CI:

| Variable | Values |
| --- | --- |
| `CREATE_APP_ARCHITECTURE` | `vite`, `nextjs`, `rsc` |
| `CREATE_APP_STYLING` | `none`, `sass`, `css-modules`, `tailwind`, `emotion` |
| `CREATE_APP_STATE` | `redux-saga`, `redux-thunk`, `none` |
| `CREATE_APP_DESIGN_SYSTEM` | `craftsman`, `chadman`, `none` |

```sh
CREATE_APP_ARCHITECTURE=nextjs CREATE_APP_STYLING=tailwind CREATE_APP_STATE=none \
CREATE_APP_DESIGN_SYSTEM=none npx @stamcat/create-react-client-app my-new-app --skip-install
```

Not every architecture/styling pairing is valid — Emotion is Vite-only. Invalid combinations
passed via environment variables are skipped silently rather than erroring, so double-check the
generated project if you're scripting this.

## What's in the generated project

The generated project ships TypeScript, ESLint + dependency-cruiser + `npm-package-json-lint`,
Prettier, Jest + Testing Library, and Playwright, plus `AGENTS.md`-based AI coding instructions
(with pointer files for GitHub Copilot, Claude, Gemini, and Cursor) tailored to the choices you
made. See the
[root README](https://github.com/Stamcat/react-client-template#whats-included) for the full
breakdown of each option.
