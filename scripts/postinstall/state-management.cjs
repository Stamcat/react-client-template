// Prompts for a state-management approach on first install and scaffolds only that one.
const fs = require("node:fs");
const path = require("node:path");
const { root, removeDependency, promptChoice } = require("./utils.cjs");

const REDUX_INDEX_PATH = path.join(root, "src", "redux", "index.ts");
const STORE_PATH = path.join(root, "src", "utils", "store.ts");
const MAIN_TSX_PATH = path.join(root, "src", "main.tsx");

function setupThunk(pkg) {
    removeDependency(pkg, "redux-saga");
    fs.writeFileSync(
        STORE_PATH,
        [
            'import { combineReducers, configureStore } from "@reduxjs/toolkit";',
            "",
            "const rootReducer = combineReducers({});",
            "",
            "export const createStore = () =>",
            "    configureStore({",
            "        reducer: rootReducer,",
            "    });",
            "",
        ].join("\n"),
    );
    fs.writeFileSync(
        REDUX_INDEX_PATH,
        [
            'import { createStore } from "@/utils/store";',
            "",
            "export const store = createStore();",
            "",
            "export type RootState = ReturnType<typeof store.getState>;",
            "export type AppDispatch = typeof store.dispatch;",
            "",
        ].join("\n"),
    );
}

function setupNone(pkg) {
    removeDependency(pkg, "redux-saga");
    removeDependency(pkg, "@reduxjs/toolkit");
    removeDependency(pkg, "react-redux");
    fs.rmSync(path.join(root, "src", "redux"), { recursive: true, force: true });
    fs.rmSync(STORE_PATH, { force: true });

    const mainTsx = fs
        .readFileSync(MAIN_TSX_PATH, "utf8")
        .split("\n")
        .filter((line) => !line.includes('from "react-redux"') && !line.includes('from "@/redux"'))
        .join("\n")
        .replace(
            /<StrictMode>\s*<Provider store={store}>\s*<App \/>\s*<\/Provider>\s*<\/StrictMode>,/,
            "<StrictMode>\n        <App />\n    </StrictMode>,",
        );
    fs.writeFileSync(MAIN_TSX_PATH, mainTsx);
}

async function setupStateManagement(pkg) {
    const question = [
        "",
        "Which state management approach should this project use?",
        "  1) Redux Toolkit + redux-saga (recommended, default)",
        "  2) Redux Toolkit + thunk",
        "  3) None — bring your own",
        "Enter a number [1]: ",
    ].join("\n");
    const choice = await promptChoice(question, { defaultValue: "1" });

    if (choice === "2") {
        setupThunk(pkg);
    } else if (choice === "3") {
        setupNone(pkg);
    }
}

module.exports = { setupStateManagement };
