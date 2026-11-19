// CLI entry point: prompts for project choices, composes template layers, writes package.json.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { composeLayers, renderProjectName } from "./compose.js";
import { promptText, promptChoice, closePrompts, setAutoYes } from "./prompts.js";
import {
    ARCHITECTURE_OPTIONS,
    STYLING_ARCHITECTURES,
    STYLING_OPTIONS,
    STATE_OPTIONS,
    DESIGN_SYSTEM_OPTIONS,
} from "./options.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_ROOT = path.join(__dirname, "..", "..", "..", "templates");

function sanitizePackageName(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9-~]+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}

async function resolveProjectName(argName) {
    const raw = argName ?? (await promptText("\nProject name (used as the folder and package name)"));
    const name = sanitizePackageName(raw ?? "");
    if (!name) {
        console.error("A valid project name is required.");
        process.exit(1);
    }
    return name;
}

function assertEmptyTarget(targetDir) {
    if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
        console.error(`\n"${targetDir}" already exists and isn't empty.`);
        process.exit(1);
    }
}

async function promptArchitecture() {
    if (process.env.CREATE_APP_ARCHITECTURE) return process.env.CREATE_APP_ARCHITECTURE;
    return promptChoice(
        "Which application architecture should this project use?",
        ARCHITECTURE_OPTIONS.map((option) => ({ ...option, implemented: true })),
    );
}

async function promptStyling(architecture) {
    if (process.env.CREATE_APP_STYLING) return process.env.CREATE_APP_STYLING;
    return promptChoice(
        "Which styling approach should this project use?",
        STYLING_OPTIONS.map((option) => ({
            ...option,
            implemented: STYLING_ARCHITECTURES[option.value].includes(architecture),
        })),
    );
}

async function promptState() {
    if (process.env.CREATE_APP_STATE) return process.env.CREATE_APP_STATE;
    return promptChoice(
        "Which state management approach should this project use?",
        STATE_OPTIONS.map((option) => ({ ...option, implemented: true })),
    );
}

async function promptDesignSystem() {
    if (process.env.CREATE_APP_DESIGN_SYSTEM) return process.env.CREATE_APP_DESIGN_SYSTEM;
    return promptChoice(
        "Install a design system?",
        DESIGN_SYSTEM_OPTIONS.map((option) => ({ ...option, implemented: true })),
        { defaultValue: "3" },
    );
}

export async function run() {
    const [, , argName, ...flags] = process.argv;
    const skipInstall = flags.includes("--skip-install");
    setAutoYes(flags.includes("--yes"));

    const projectName = await resolveProjectName(argName?.startsWith("-") ? undefined : argName);
    const targetDir = path.resolve(process.cwd(), projectName);
    assertEmptyTarget(targetDir);

    const architecture = await promptArchitecture();
    const styling = await promptStyling(architecture);
    const state = await promptState();
    const designSystem = await promptDesignSystem();
    closePrompts();

    const layerDirs = [
        path.join(TEMPLATES_ROOT, "base"),
        path.join(TEMPLATES_ROOT, "architecture", architecture),
        path.join(TEMPLATES_ROOT, "styling", styling, architecture),
        path.join(TEMPLATES_ROOT, "state", state, architecture),
        path.join(TEMPLATES_ROOT, "design-system", designSystem),
    ];

    await composeLayers({
        layerDirs,
        basePkgTemplatePath: path.join(TEMPLATES_ROOT, "base", "package.json.template"),
        targetDir,
        projectName,
    });
    await renderProjectName(targetDir, projectName);

    console.log(`\nCreated ${projectName} at ${targetDir}`);

    if (skipInstall) {
        console.log(`\nRun "cd ${projectName} && npm install && npm run dev" to get started.`);
        return;
    }

    console.log("\nInstalling dependencies...");
    const result = spawnSync("npm", ["install"], { cwd: targetDir, stdio: "inherit" });
    if (result.status !== 0) {
        console.error("\nnpm install failed — run it manually once resolved.");
        process.exit(result.status ?? 1);
    }

    console.log(`\nDone. Run "cd ${projectName} && npm run dev" to get started.`);
}
