// Prompts for a state-management approach on first install and scaffolds only that one.
const fs = require("node:fs");
const path = require("node:path");
const { root, removeDependency, promptChoice } = require("./utils.cjs");

const REDUX_INDEX_PATH = path.join(root, "src", "redux", "index.ts");
const STORE_PATH = path.join(root, "src", "utils", "store.ts");
const MAIN_TSX_PATH = path.join(root, "src", "main.tsx");

// Next.js root files (_app.tsx, providers.tsx) replace main.tsx as the Provider wrapper's home.
function getRootFilePath(architecture) {
    if (architecture === "nextjs") {
        return path.join(root, "src", "pages", "_app.tsx");
    }
    if (architecture === "rsc") {
        return path.join(root, "src", "app", "providers.tsx");
    }
    return MAIN_TSX_PATH;
}

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

function setupNone(pkg, architecture) {
    removeDependency(pkg, "redux-saga");
    removeDependency(pkg, "@reduxjs/toolkit");
    removeDependency(pkg, "react-redux");
    fs.rmSync(path.join(root, "src", "redux"), { recursive: true, force: true });
    fs.rmSync(STORE_PATH, { force: true });

    if (architecture === "nextjs") {
        fs.writeFileSync(
            getRootFilePath(architecture),
            [
                'import type { AppProps } from "next/app";',
                "",
                "export default function App({ Component, pageProps }: AppProps) {",
                "    return <Component {...pageProps} />;",
                "}",
                "",
            ].join("\n"),
        );
        return;
    }

    if (architecture === "rsc") {
        fs.rmSync(getRootFilePath(architecture), { force: true });
        const layoutPath = path.join(root, "src", "app", "layout.tsx");
        const layout = fs
            .readFileSync(layoutPath, "utf8")
            .replace('import { Providers } from "./providers";\n', "")
            .replace("<Providers>{children}</Providers>", "{children}");
        fs.writeFileSync(layoutPath, layout);
        return;
    }

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

async function setupStateManagement(pkg, architecture) {
    const question = [
        "",
        "Which state management approach should this project use?",
        "  1) Redux Toolkit + redux-saga",
        "  2) Redux Toolkit + thunk",
        "  3) None — bring your own",
        "Enter a number [1]: ",
    ].join("\n");
    const choice = await promptChoice(question, { defaultValue: "1" });

    if (choice === "2") {
        setupThunk(pkg);
    } else if (choice === "3") {
        setupNone(pkg, architecture);
    }
}

module.exports = { setupStateManagement };
