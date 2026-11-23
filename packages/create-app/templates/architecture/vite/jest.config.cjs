/** @type {import('jest').Config} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "\\.module\\.(scss|css)$": "identity-obj-proxy",
        "\\.css$": "identity-obj-proxy",
    },
    testMatch: ["<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)"],
    collectCoverageFrom: ["src/**/*.(ts|tsx)", "!src/**/*.d.ts", "!src/**/__tests__/**/*", "!src/**/index.ts"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    transform: {
        // The root tsconfig.json only holds project references (no jsx/compiler options), so ts-jest
        // needs pointing at tsconfig.app.json explicitly to transform TSX test files.
        "^.+\\.(ts|tsx)$": ["ts-jest", { isolatedModules: true, tsconfig: "tsconfig.app.json" }],
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    // Some libraries (and their own dependencies) ship ESM-only compiled output, so node_modules can't
    // be blanket skip-transformed the way Jest does by default.
    transformIgnorePatterns: [],
    moduleDirectories: ["node_modules", "<rootDir>/src"],
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
    collectCoverage: false,
};
