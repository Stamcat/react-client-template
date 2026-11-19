/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
    forbidden: [
        {
            name: "no-circular",
            severity: "error",
            comment:
                "This dependency is part of a circular relationship. You might want to revise your solution " +
                "(e.g. dependency inversion, single-responsibility modules).",
            from: {},
            to: { circular: true },
        },
    ],
    options: {
        doNotFollow: {
            path: ["node_modules"],
            dependencyTypes: ["npm", "npm-dev", "npm-optional", "npm-peer", "npm-bundled", "npm-no-pkg"],
        },
        tsConfig: {
            fileName: "tsconfig.app.json",
        },
    },
};
