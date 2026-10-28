import js from "@eslint/js";
import globals from "globals";
import eslintReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import sonarjs from "eslint-plugin-sonarjs";
import prettier from "eslint-plugin-prettier/recommended";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";

export default tseslint.config([
    globalIgnores(["dist", "coverage"]),
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            tseslint.configs.eslintRecommended,
            reactHooks.configs["recommended-latest"],
            reactRefresh.configs.vite,
            sonarjs.configs.recommended,
            prettier,
            comments.recommended,
            eslintReact.configs.flat.recommended,
            eslintReact.configs.flat["jsx-runtime"],
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-hooks/exhaustive-deps": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "no-console": "error",
            "max-params": ["error", 7],
            "max-lines": ["error", 1000],
            "react/prop-types": "error",
            "react/no-unescaped-entities": "error",
            "react/jsx-no-bind": "error",
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
            complexity: ["error", 15],
            "sonarjs/cognitive-complexity": ["off", 15],
            "consistent-return": ["error"],
            "no-duplicate-imports": ["error"],
            "no-shadow": "error",
            "sonarjs/no-dead-store": ["error"],
            "sonarjs/no-duplicated-branches": ["error"],
            "sonarjs/no-inverted-boolean-check": ["error"],
            "sonarjs/no-gratuitous-expressions": ["error"],
            "sonarjs/duplicates-in-character-class": ["error"],
            "sonarjs/no-nested-conditional": ["error"],
            "sonarjs/no-nested-functions": ["error"],
            "sonarjs/no-redundant-assignments": ["error"],
            "sonarjs/prefer-single-boolean-return": ["error"],
            "sonarjs/pseudo-random": ["error"],
            "sonarjs/no-use-of-empty-return-value": ["error"],
            "sonarjs/todo-tag": ["error"],
            "sonarjs/slow-regex": ["error"],
            "sonarjs/no-all-duplicated-branches": ["error"],
            "sonarjs/no-collection-size-mischeck": ["error"],
            "sonarjs/no-commented-code": ["error"],
            "sonarjs/no-identical-expressions": ["error"],
            "sonarjs/no-identical-functions": ["error"],
            "sonarjs/no-ignored-exceptions": ["error"],
            "sonarjs/no-invariant-returns": ["error"],
            "sonarjs/no-nested-template-literals": ["error"],
            "sonarjs/use-type-alias": ["error"],
            "sonarjs/no-unused-vars": ["off"],
            "sonarjs/void-use": ["error"],
            "@typescript-eslint/no-empty-function": "warn",
            "@typescript-eslint/explicit-member-accessibility": "error",
            "@typescript-eslint/no-shadow": ["off"],
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                },
            ],
            curly: ["error"],
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@eslint-community/eslint-comments/require-description": ["error", { ignore: [] }],
            "@eslint-community/eslint-comments/no-unused-disable": "off",
            "prettier/prettier": [
                "error",
                {
                    endOfLine: "auto",
                },
            ],
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "react-redux",
                            importNames: ["useState"],
                            message: "Please use useSelector() to access Redux state hooks",
                        },
                        {
                            name: "react-redux",
                            importNames: ["useEffect"],
                            message: "Please use useDispatch() to access Redux dispatch hooks",
                        },
                        {
                            name: "react-redux",
                            importNames: ["ConnectedProps"],
                            message: "Please type out your component instead of inferring it from elsewhere.",
                        },
                    ],
                },
            ],
        },
    },
]);
