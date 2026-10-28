---
name: data-validation
description: 'Zod schema conventions for the app standards data boundaries — colocated schemas.ts, transform-based reshaping, matching store field names to the source, schema-level defaults. Use when adding or reviewing an api.ts/schemas.ts/types.ts anywhere in the repo, or any code that parses/serializes data crossing an API, storage, URL, postMessage, or webview boundary.'
---

# App Standards Data Validation

Applies to application code across the repo.

- Validate **anything that enters or leaves the app** with a Zod schema, so the schema (not just a
  TypeScript type) is the enforced contract — this is not limited to HTTP API requests/responses.
  It also covers: `sessionStorage`/`localStorage` reads (a stored JSON blob is just as untrusted as
  a network response), URL/query-string params, `postMessage`/webview native-bridge injection
  payloads, decoded JWT claims, and any other value crossing a serialization boundary (i.e.
  anything that was JSON, a string, or otherwise untyped at the point it entered the app). If you
  find yourself writing `JSON.parse(...)` or reading from an untyped external payload (`data: any`)
  and shaping it by hand, that is exactly the case this rule targets — replace the hand-written
  mapping with a Zod schema and `.parse`/`.safeParse` instead. Prefer `safeParse` with an explicit
  fallback over `parse` when a bad payload shouldn't crash the UI.
  **This is the one mandatory use of Zod** — every boundary crossing must go through a schema.
- Outside of boundaries, Zod is a tool you may reach for when it's genuinely the simplest option
  (e.g. parsing/validating a complex internal string format, or sharing a `.refine()` rule across
  call sites) — it is not required there. Don't wrap an already-exhaustive, compile-time-checked
  TypeScript construct (a `Record` lookup, a union-typed switch, a plain function over typed
  values already validated at the boundary) in a Zod schema just for the sake of using Zod; that
  adds runtime overhead and indirection without closing any real gap.
- Declare Zod schemas in a colocated `schemas.ts` file (one per component folder), not inlined in
  `api.ts`/`slice.ts`/`types.ts`. `types.ts` should only hold `z.infer<typeof Schema>` type
  exports and plain TS types.
- When an incoming payload needs reshaping to the app's internal type — an API response, a
  sessionStorage record, decoded JWT claims, whatever the source — do it with `.transform()` (and
  `.pipe()` into the target schema if further validating the transformed shape) directly on the
  Zod schema, not with a separate hand-written mapper function — the schema stays the single
  source of truth for both validation and the mapping.
- Default a store's field names, and field names' casing/shape, to match the source's own naming
  rather than inventing a new UI-side vocabulary — a field only gets renamed or reshaped in
  `.transform()` when it's genuinely derived (computed from another field, or not present in the
  source at all). Spread the parsed source object and override only those genuinely-derived
  fields, instead of listing every field by hand.
- Declare per-field defaults (e.g. null-to-0 coercion) on that field in the raw API schema itself
  (e.g. `z.number().nullable().transform((v) => v ?? 0)`), not as a `?? fallback` inside the
  object-level `.transform()` body.
- Prefer a schema-level default over letting `null`/`undefined` propagate into the UI: coerce
  nullable numbers to `0`, nullable arrays/strings to `[]`/`""`, etc., whenever the field has an
  obvious "empty" value the UI can render directly. This keeps component state predictable (no
  extra `null` branch to guard against) and lets empty-state UI be driven by a plain
  `array.length === 0` / `value === 0` check instead of a `null` check. Only leave a field
  nullable (no default) when `null` is itself meaningful and the UI must distinguish "not loaded"
  from "empty".
- When the raw API schema and its transformed/UI-facing schema share a set of fields, factor those
  shared fields into a base `z.object({...})` and have both schemas `.extend()` it, rather than
  listing the same fields twice.
- Derive the TypeScript type from the schema (`z.infer<typeof Schema>`) rather than hand-writing a
  parallel interface, so the type and the runtime check can't drift apart.
- Use optional chaining (`?.`) only where a value is genuinely optional/unverified at that point.
  Once a Zod schema has validated a field as required, treat it as required (no `?.`) rather than
  chaining defensively to silence TypeScript.

Not machine-enforced — check for this in review.
