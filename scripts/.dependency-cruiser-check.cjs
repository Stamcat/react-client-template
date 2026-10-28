/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
    forbidden: [
        {
            name: "no-circular",
            severity: "warn",
            comment:
                "This dependency is part of a circular relationship. You might want to revise your solution " +
                "(e.g. dependency inversion, single-responsibility modules). Promote this to 'error' once the " +
                "codebase has no existing circular dependencies left to fix incrementally.",
            from: {},
            to: { circular: true },
        },
        {
            name: "no-orphans",
            comment:
                "This is an orphan module - it's likely not used (anymore). Either use it, remove it, or add an " +
                "exception here if it's logically an orphan (e.g. a config file).",
            severity: "warn",
            from: {
                orphan: true,
                pathNot: [
                    String.raw`(^|/)\.[^/]+\.(js|cjs|mjs|ts|json)$`,
                    String.raw`\.d\.ts$`,
                    String.raw`types\.ts$`,
                    String.raw`(^|/)tsconfig\.json$`,
                    String.raw`\.test\.\w+$`,
                    String.raw`(^|/)(vite|jest)\.config\.(js|cjs|mjs|ts|json)$`,
                ],
            },
            to: {},
        },
        {
            name: "no-non-package-json",
            severity: "error",
            comment: "This module depends on an npm package that isn't declared in package.json.",
            from: {},
            to: { dependencyTypes: ["npm-no-pkg", "npm-unknown"] },
        },
        {
            name: "not-to-unresolvable",
            severity: "error",
            comment: "This module depends on a module that cannot be resolved on disk.",
            from: {},
            to: { couldNotResolve: true },
        },
        {
            name: "not-to-spec",
            severity: "error",
            comment: "This module depends on a test file. Factor shared logic out into a non-test module instead.",
            from: {},
            to: { path: String.raw`\.(spec|test)\.(js|mjs|cjs|ts|tsx)$` },
        },
        {
            name: "no-deep-redux-imports",
            severity: "error",
            comment:
                "Only `@/redux` (src/redux/index.ts) is a valid import path for application code — see " +
                ".github/skills/state-management/SKILL.md. Add feature reducers/sagas there instead of reaching " +
                "into a subfolder directly.",
            from: { path: "^src", pathNot: "^src/redux" },
            to: { path: String.raw`^src/redux/[^/]+/` },
        },
    ],
    options: {
        doNotFollow: {
            path: "node_modules",
            dependencyTypes: ["npm", "npm-dev", "npm-optional", "npm-peer", "npm-bundled", "npm-no-pkg"],
        },
        tsConfig: {
            fileName: "tsconfig.app.json",
        },
        enhancedResolveOptions: {
            exportsFields: ["exports"],
            conditionNames: ["import", "require", "node", "default"],
        },
    },
};
