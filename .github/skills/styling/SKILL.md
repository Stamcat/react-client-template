---
name: styling
description: 'Styling, responsive design, and shared UI component conventions for the app standards (SCSS Modules by default, CSS-in-JS/Tailwind opt-in only, mobile-first breakpoints). Use when writing or reviewing styles, layout, or markup anywhere in the repo.'
---

# App Standards Styling

Applies to application code across the repo.

## SCSS by default

- SCSS Modules are the default for application styling.
- Neither CSS-in-JS (`styled-components`, `@emotion/react`/`@emotion/styled`) nor Tailwind-like
  utility-class patterns (including `clsx`/`tailwind-merge`) are used out of the box, and neither
  is encouraged — don't introduce either unprompted. Both remain available if a developer
  explicitly decides to use that pattern for a given area; don't mix one into a component that's
  already using SCSS Modules.
- Once a developer has explicitly opted into CSS-in-JS or Tailwind for an area, keep following
  that choice for new work in that area — don't revert it back to SCSS Modules unprompted just
  because SCSS is the default.
- Prefer semantic HTML5 elements (`section`, `article`, `nav`, `header`, `footer`, `aside`, etc.)
  over generic `div`/`span` where one fits the content's role.
- Use CSS Modules (`*.module.scss`) and nest each component's rules under a single root class so
  styles stay scoped to that component and can't leak into or be overridden by unrelated markup.
- SCSS class names are kebab-case (e.g. `.contact-card`, `.showcase-header`), never camelCase or
  snake_case.

## When a plain (non-module) stylesheet is appropriate

- Default to CSS Modules (`*.module.scss`). Reach for a plain `.scss` file instead only when most
  of a component's rules need to target a third-party component's rendered class names that have
  no prop-based override — in a CSS Module those selectors would need `:global(...)` on every
  rule, which adds noise without adding scoping value since they're already global names.
- Still nest every rule under a single root class (e.g. `.add-note-modal { ... }`) so the
  stylesheet's own classes don't leak — only the specific third-party classes being targeted are
  intentionally left unscoped.
- Import a plain stylesheet as a side-effect import (`import "./Foo.scss";`) and reference class
  names as literal strings (`className="foo"`), not via a `styles` object.
- This is the exception, not the default — if only one or two selectors would need `:global()`,
  keep the file as a CSS Module and wrap just those.

## Don't declare a class for every element

- A `className` earns its place by doing one of: defining a layout/structural block, or
  disambiguating between sibling elements of the same tag that need different rules. If neither
  is true, don't add one — style the bare tag with a nested selector instead.
- Nest bare-element selectors (`h2`, `p`, `dl`, `dt`, `dd`, `a`, ...) directly under the enclosing
  block class rather than inventing `&__title`/`&__subtitle`/`&__label`-style classes whose only
  job is to select "the one heading/paragraph/label in this card." One `<h2>` inside `.card` only
  ever needs `.card h2 { ... }`.
- Before adding a new BEM element class, check whether the element it targets is the only one of
  its tag within the parent block. If it is, nest the tag selector under the parent instead of
  adding a class.
- Use real Sass, not a flat list of one-off classes: reach for `@mixin`/`@include` for repeated
  rule groups, `@function` for repeated calculations, `%placeholder`/`@extend` for shared base
  styles, and `&`-nesting for state/modifiers (`&:hover`, `&--active`) instead of hand-rolling the
  same declarations under multiple class names.

## Prefer a shared UI component library

- Before writing any custom markup or CSS for a UI element (buttons, inputs, selects, badges,
  loaders, modals, tooltips, pagination, etc.), check whether the project's shared/design-system
  component library already exports an equivalent component. Use it instead of a bespoke
  `<button>`/`<div>`/hand-rolled styles — this applies even for small, seemingly trivial elements
  like a single action button.
- Only build custom markup/CSS for the parts a shared component doesn't cover (e.g. positioning it
  within a layout, or a piece of UI the library genuinely has no component for).
- When a common shared component needs project-specific styling, add/extend the override in a
  central theme module rather than restyling it locally inside the component folder.
- If this project has no shared component library yet, note that decision here once one is
  adopted (package name, import pattern) so this skill stays accurate.

## Responsive design

- Mobile-first: write the base (unwrapped) rules for mobile, then layer on `tablet`/`desktop`/etc.
  overrides via media queries. Don't build a mobile layout on top of desktop-first rules.
- Don't duplicate DOM elements/components to handle different breakpoints when a media query on
  the existing markup will do the job.
- Prefer a shared breakpoint helper (a SCSS mixin or JS/TS constant) over hand-rolled, repeated
  `@media` pixel values once more than one component needs the same breakpoint.

## Enforcement

SCSS Modules as the default, and treating CSS-in-JS/Tailwind-like patterns as opt-in rather than
banned, aren't machine-enforced — check for them in review, same as mobile-first responsive
styling and preferring shared breakpoint helpers.
