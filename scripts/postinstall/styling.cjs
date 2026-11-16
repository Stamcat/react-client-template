// Prompts for a styling approach on first install and scaffolds only that one.
const fs = require("node:fs");
const path = require("node:path");
const { root, addDependency, promptChoice } = require("./utils.cjs");

const TEMPLATES_DIR = path.join(__dirname, "templates", "styling");
const APP_DIR = path.join(root, "src", "components", "App");
const APP_TSX_PATH = path.join(APP_DIR, "App.tsx");
const MAIN_TSX_PATH = path.join(root, "src", "main.tsx");
const VITE_CONFIG_PATH = path.join(root, "vite.config.ts");
const INDEX_CSS_PATH = path.join(root, "src", "index.css");

function copyTemplate(templateName, fileName, destPath) {
    fs.writeFileSync(destPath, fs.readFileSync(path.join(TEMPLATES_DIR, templateName, fileName), "utf8"));
}

function setupNone() {
    copyTemplate("none", "App.tsx", APP_TSX_PATH);
}

function setupSass(pkg) {
    addDependency(pkg, "sass", "1.107.0", { dev: true });
    copyTemplate("sass", "App.module.scss", path.join(APP_DIR, "App.module.scss"));
    copyTemplate("sass", "App.tsx", APP_TSX_PATH);
}

function setupCssModules() {
    copyTemplate("css-modules", "App.module.css", path.join(APP_DIR, "App.module.css"));
    copyTemplate("css-modules", "App.tsx", APP_TSX_PATH);
}

function setupEmotion(pkg) {
    addDependency(pkg, "@emotion/react", "11.14.0");
    addDependency(pkg, "@emotion/styled", "11.14.1");
    copyTemplate("emotion", "App.tsx", APP_TSX_PATH);
}

// Next.js root files (_app.tsx, layout.tsx) have no shared import to anchor on, so prepend instead.
function getRootFilePath(architecture) {
    if (architecture === "nextjs") {
        return path.join(root, "src", "pages", "_app.tsx");
    }
    if (architecture === "rsc") {
        return path.join(root, "src", "app", "layout.tsx");
    }
    return MAIN_TSX_PATH;
}

function setupTailwind(pkg, architecture) {
    addDependency(pkg, "tailwindcss", "4.3.3", { dev: true });

    copyTemplate("tailwind", "index.css", INDEX_CSS_PATH);
    copyTemplate("tailwind", "App.tsx", APP_TSX_PATH);

    const rootFilePath = getRootFilePath(architecture);
    const rootFile = fs.readFileSync(rootFilePath, "utf8");
    fs.writeFileSync(rootFilePath, `import "@/index.css";\n${rootFile}`);

    if (architecture === "react") {
        addDependency(pkg, "@tailwindcss/vite", "4.3.3", { dev: true });
        const viteConfig = fs
            .readFileSync(VITE_CONFIG_PATH, "utf8")
            .replace(
                'import react from "@vitejs/plugin-react-swc";',
                'import react from "@vitejs/plugin-react-swc";\nimport tailwindcss from "@tailwindcss/vite";',
            )
            .replace("plugins: [react()],", "plugins: [react(), tailwindcss()],");
        fs.writeFileSync(VITE_CONFIG_PATH, viteConfig);
        return;
    }

    addDependency(pkg, "@tailwindcss/postcss", "4.3.3", { dev: true });
    fs.writeFileSync(
        path.join(root, "postcss.config.mjs"),
        ['const config = {', '    plugins: ["@tailwindcss/postcss"],', "};", "", "export default config;", ""].join("\n"),
    );
}

async function setupStyling(pkg, architecture) {
    const question = [
        "",
        "Which styling approach should this project use?",
        "  1) None — create your own (recommended, default)",
        "  2) SCSS Modules",
        "  3) CSS Modules",
        "  4) Tailwind CSS",
        "  5) Emotion (@emotion/styled + @emotion/react)",
        "Enter a number [1]: ",
    ].join("\n");
    const choice = await promptChoice(question, { defaultValue: "1" });

    if (choice === "2") {
        setupSass(pkg);
    } else if (choice === "3") {
        setupCssModules();
    } else if (choice === "4") {
        setupTailwind(pkg, architecture);
    } else if (choice === "5") {
        setupEmotion(pkg);
    } else {
        setupNone();
    }
}

module.exports = { setupStyling };
