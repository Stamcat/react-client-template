# Agent Instructions — react-client-template

This file is the canonical source of AI coding instructions for this repository. `CLAUDE.md`,
`.github/copilot-instructions.md`, and `.cursor/rules/app-standards.mdc` all point back to this
file instead of duplicating its content, so Claude, GitHub Copilot, and Cursor all pick up the
same rules.

## App Standards

Treat all application code as app-standard code for AI guidance and code review: use the patterns
below everywhere unless a file is explicitly being left untouched.

The lint and dependency rules are enforced directly by the repo config; do not depend on a
manifest file to decide whether a pattern is allowed.

Prefer named exports for app code and avoid default exports unless there is a clear, justified
exception such as framework-required lazy loading. New components and modules should use
`export const Foo = ...` and named imports by default.

Keep function names short and meaningful — 2-3 words that name the action and its subject
(`setLogDestinations`, `loadClientProfile`). Don't stack qualifiers onto a name to describe every
caller or code path that reaches it; the function's job is implied by its module and its one
short doc comment, not by its name.

Code comments must be a single short line stating something the code itself can't show (a
non-obvious reason, ordering constraint, or gotcha) — never a restatement of what the next line
does. Do not write multi-line or multi-paragraph comments in source files; if something needs
that much explanation, it belongs in this file, a skill doc, or a PR description instead.

When writing or editing styles/markup, prefer semantic HTML5 elements and Sass nesting over adding
a `className` for every element. Read [styling](.github/skills/styling/SKILL.md) before touching
SCSS/markup — a `className` is only justified for structural/layout blocks or to disambiguate
sibling elements of the same tag, not as a default habit.

Any new or modified markup must be accessible: semantic structure, labeled form controls,
keyboard/focus support, and sufficient color contrast. Read
[accessibility](.github/skills/accessibility/SKILL.md) before touching component markup. This is a
requirement for every new component and every component being refactored, applied as part of the
same change — not a follow-up task only done when explicitly asked for an a11y review.

## App Standards Skills

Detailed, topic-specific conventions live as skills under `.github/skills/` rather than inline
here, so this file stays a short index as the rule set grows. Read the linked skill before
touching the corresponding area of application code:

| Topic | Skill |
| --- | --- |
| SCSS/CSS Modules, responsive design, shared UI component usage | [styling](.github/skills/styling/SKILL.md) |
| Import boundaries, self-sufficiency, internal ordering, mount-effect guards | [component-architecture](.github/skills/component-architecture/SKILL.md) |
| Redux Toolkit + redux-saga, slice/saga colocation | [state-management](.github/skills/state-management/SKILL.md) |
| Routes vs query strings | [routing](.github/skills/routing/SKILL.md) |
| Zod schemas at data boundaries (API, storage, URL, postMessage/webview) | [data-validation](.github/skills/data-validation/SKILL.md) |
| Semantic structure, ARIA, keyboard/focus, color contrast | [accessibility](.github/skills/accessibility/SKILL.md) |
| Catch-block error logs, saga API-response debug logs, warn vs error levels | [logging](.github/skills/logging/SKILL.md) |
| Skeleton loaders for deep-linkable routes' initial loading state | [loading-states](.github/skills/loading-states/SKILL.md) |

This skill set is a starting point, not a ceiling. As the app matures and new cross-cutting
conventions emerge (a new data-fetching pattern, a testing convention, a performance budget, a
rule about a newly-introduced legacy area), add a new skill folder under `.github/skills/` rather
than growing this file — keep this file to the index table and the enforcement summary below.

## Enforcement summary

| Rule | Enforced by |
| --- | --- |
| No deep `src/redux/<folder>` imports | `eslint.config.js` + dependency-cruiser `no-deep-redux-imports` |

Dependency-cruiser rules run against the config at `scripts/.dependency-cruiser-check.cjs`. Add a
row here — and a matching rule in `eslint.config.js` and/or
`scripts/.dependency-cruiser-check.cjs` — every time a new convention below becomes machine
enforceable, so this table stays the single place to check whether a rule is actually checked by
tooling or relies on review.

Mobile-first responsive styling, preferring routes over query strings for distinct views, and the
conventions in each skill's own "not machine-enforced" notes are expectations to follow but aren't
machine-enforced — check for them in review.

Run `npm run lint` (ESLint + dependency-cruiser + package lint) before finishing any change.
