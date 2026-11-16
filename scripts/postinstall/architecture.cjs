// Prompts for an application architecture on first install and scaffolds only that one.
const fs = require("node:fs");
const path = require("node:path");
const { root, addDependency, removeDependency, getLatestVersion, promptChoice } = require("./utils.cjs");

const TEMPLATES_DIR = path.join(__dirname, "templates", "architecture");
const VITE_CONFIG_PATH = path.join(root, "vite.config.ts");

function copyTemplate(templateName, fileName, destPath) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, fs.readFileSync(path.join(TEMPLATES_DIR, templateName, fileName), "utf8"));
}

function removeViteScaffold(pkg) {
    removeDependency(pkg, "vite");
    removeDependency(pkg, "@vitejs/plugin-react-swc");
    removeDependency(pkg, "react-router-dom");
    fs.rmSync(path.join(root, "index.html"), { force: true });
    fs.rmSync(path.join(root, "vite.config.ts"), { force: true });
    fs.rmSync(path.join(root, "src", "main.tsx"), { force: true });
    fs.rmSync(path.join(root, "src", "vite-env.d.ts"), { force: true });
    fs.rmSync(path.join(root, "tsconfig.app.json"), { force: true });
    fs.rmSync(path.join(root, "tsconfig.node.json"), { force: true });
}

function setNextScripts(pkg, entryFilePath) {
    pkg.scripts.dev = "next dev";
    pkg.scripts["dev:force"] = "next dev --turbopack";
    pkg.scripts.build = "next build";
    pkg.scripts.preview = "next start";
    pkg.scripts["lint:dependencies"] =
        `dependency-cruiser --config scripts/.dependency-cruiser-check.cjs ${entryFilePath} src`;
    pkg.scripts["lint:dependencies:circular"] =
        `dependency-cruiser --config scripts/.dependency-cruiser-check-circular.cjs ${entryFilePath} src`;
}

// Playwright and Jest-driven dev servers assume Vite's port; Next.js defaults to 3000.
function setPlaywrightPort() {
    const playwrightConfigPath = path.join(root, "playwright.config.ts");
    const playwrightConfig = fs
        .readFileSync(playwrightConfigPath, "utf8")
        .replaceAll("http://localhost:5173", "http://localhost:3000");
    fs.writeFileSync(playwrightConfigPath, playwrightConfig);
}

function setupNextjs(pkg) {
    removeViteScaffold(pkg);
    addDependency(pkg, "next", getLatestVersion("next", "15.5.4"));
    setNextScripts(pkg, "src/pages/_app.tsx");
    setPlaywrightPort();

    copyTemplate("nextjs", "next.config.ts", path.join(root, "next.config.ts"));
    copyTemplate("nextjs", "next-env.d.ts", path.join(root, "next-env.d.ts"));
    copyTemplate("nextjs", "tsconfig.json", path.join(root, "tsconfig.json"));
    copyTemplate("nextjs", "_app.tsx", path.join(root, "src", "pages", "_app.tsx"));
    copyTemplate("nextjs", "index.tsx", path.join(root, "src", "pages", "index.tsx"));
}

function setupRsc(pkg) {
    removeViteScaffold(pkg);
    addDependency(pkg, "next", getLatestVersion("next", "15.5.4"));
    setNextScripts(pkg, "src/app/layout.tsx");
    setPlaywrightPort();

    copyTemplate("rsc", "next.config.ts", path.join(root, "next.config.ts"));
    copyTemplate("rsc", "next-env.d.ts", path.join(root, "next-env.d.ts"));
    copyTemplate("rsc", "tsconfig.json", path.join(root, "tsconfig.json"));
    copyTemplate("rsc", "layout.tsx", path.join(root, "src", "app", "layout.tsx"));
    copyTemplate("rsc", "page.tsx", path.join(root, "src", "app", "page.tsx"));
    copyTemplate("rsc", "providers.tsx", path.join(root, "src", "app", "providers.tsx"));
}

async function setupPrerender(pkg) {
    const question = [
        "",
        "A client-only SPA renders an empty page for crawlers that don't execute JS, hurting SEO.",
        "Include vite-plugin-prerender to generate static HTML snapshots of each route at build time?",
        "  1) No (default)",
        "  2) Yes",
        "Enter a number [1]: ",
    ].join("\n");
    const choice = await promptChoice(question, { defaultValue: "1" });
    if (choice !== "2") {
        return;
    }

    addDependency(pkg, "vite-plugin-prerender", getLatestVersion("vite-plugin-prerender", "1.0.37"), { dev: true });
    const viteConfig = fs
        .readFileSync(VITE_CONFIG_PATH, "utf8")
        .replace(
            'import react from "@vitejs/plugin-react-swc";',
            'import react from "@vitejs/plugin-react-swc";\nimport prerender from "vite-plugin-prerender";',
        )
        .replace(
            "plugins: [react()],",
            [
                "plugins: [",
                "        react(),",
                "        // List every route this app serves so crawlers get real HTML, not an empty root div.",
                '        prerender({ staticDir: "dist", routes: ["/"] }),',
                "    ],",
            ].join("\n"),
        );
    fs.writeFileSync(VITE_CONFIG_PATH, viteConfig);
}

async function setupArchitecture(pkg) {
    const question = [
        "",
        "Which application architecture should this project use?",
        "  1) React (Vite SPA)",
        "  2) Next.js (Pages Router)",
        "  3) React Server Components (Next.js App Router)",
        "Enter a number [1]: ",
    ].join("\n");
    const choice = await promptChoice(question, { defaultValue: "1" });

    if (choice === "2") {
        setupNextjs(pkg);
        return "nextjs";
    }
    if (choice === "3") {
        setupRsc(pkg);
        return "rsc";
    }
    await setupPrerender(pkg);
    return "react";
}

module.exports = { setupArchitecture };
