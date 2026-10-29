// Prompts for a styling approach on first install and scaffolds only that one.
const fs = require("node:fs");
const path = require("node:path");
const { root, addDependency, promptChoice } = require("./utils.cjs");

const APP_TSX_PATH = path.join(root, "src", "components", "App", "App.tsx");
const MAIN_TSX_PATH = path.join(root, "src", "main.tsx");
const VITE_CONFIG_PATH = path.join(root, "vite.config.ts");

function setupScss(pkg) {
    addDependency(pkg, "sass", "1.107.0", { dev: true });
    fs.writeFileSync(
        path.join(root, "src", "components", "App", "App.module.scss"),
        ".app {\n    h1 {\n        margin: 0;\n    }\n}\n",
    );
    fs.writeFileSync(
        APP_TSX_PATH,
        [
            'import styles from "./App.module.scss";',
            "",
            "export const App = () => {",
            "    return (",
            '        <main className={styles.app}>',
            "            <h1>React Client Template</h1>",
            "        </main>",
            "    );",
            "};",
            "",
        ].join("\n"),
    );
}

function setupStyledComponents(pkg) {
    addDependency(pkg, "styled-components", "6.6.0");
    fs.writeFileSync(
        APP_TSX_PATH,
        [
            'import styled from "styled-components";',
            "",
            "const Layout = styled.main`",
            "    h1 {",
            "        margin: 0;",
            "    }",
            "`;",
            "",
            "export const App = () => {",
            "    return (",
            "        <Layout>",
            "            <h1>React Client Template</h1>",
            "        </Layout>",
            "    );",
            "};",
            "",
        ].join("\n"),
    );
}

function setupTailwind(pkg) {
    addDependency(pkg, "tailwindcss", "4.3.3", { dev: true });
    addDependency(pkg, "@tailwindcss/vite", "4.3.3", { dev: true });

    fs.writeFileSync(path.join(root, "src", "index.css"), '@import "tailwindcss";\n');

    const viteConfig = fs
        .readFileSync(VITE_CONFIG_PATH, "utf8")
        .replace(
            'import react from "@vitejs/plugin-react-swc";',
            'import react from "@vitejs/plugin-react-swc";\nimport tailwindcss from "@tailwindcss/vite";',
        )
        .replace("plugins: [react()],", "plugins: [react(), tailwindcss()],");
    fs.writeFileSync(VITE_CONFIG_PATH, viteConfig);

    const mainTsx = fs
        .readFileSync(MAIN_TSX_PATH, "utf8")
        .replace(
            'import { App } from "@/components/App/App";',
            'import "@/index.css";\nimport { App } from "@/components/App/App";',
        );
    fs.writeFileSync(MAIN_TSX_PATH, mainTsx);

    fs.writeFileSync(
        APP_TSX_PATH,
        [
            "export const App = () => {",
            "    return (",
            '        <main className="p-4">',
            '            <h1 className="text-2xl font-bold">React Client Template</h1>',
            "        </main>",
            "    );",
            "};",
            "",
        ].join("\n"),
    );
}

async function setupStyling(pkg) {
    const question = [
        "",
        "Which styling approach should this project use?",
        "  1) SCSS Modules (recommended, default)",
        "  2) styled-components",
        "  3) Tailwind CSS",
        "Enter a number [1]: ",
    ].join("\n");
    const choice = await promptChoice(question, { defaultValue: "1" });

    if (choice === "2") {
        setupStyledComponents(pkg);
    } else if (choice === "3") {
        setupTailwind(pkg);
    } else {
        setupScss(pkg);
    }
}

module.exports = { setupStyling };
