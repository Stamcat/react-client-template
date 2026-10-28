/** @type {import('jest').Config} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    testMatch: ["<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)", "<rootDir>/src/**/*.(test|spec).(ts|tsx|js)"],
    collectCoverageFrom: ["src/**/*.(ts|tsx)", "!src/**/*.d.ts", "!src/**/__tests__/**/*", "!src/**/index.ts"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    transform: {
        "^.+\\.(ts|tsx)$": ["ts-jest", { isolatedModules: true }],
    },
    moduleDirectories: ["node_modules", "<rootDir>/src"],
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
    collectCoverage: false,
};
