// Single postinstall entry point: renames the package, then runs one-time setup prompts.
const fs = require("node:fs");
const path = require("node:path");
const { root, readPkg, writePkg, closePrompt } = require("./utils.cjs");
const { setPackageName } = require("./package-name.cjs");
const { setupStyling } = require("./styling.cjs");
const { setupDesignSystem } = require("./design-system.cjs");
const { setupStateManagement } = require("./state-management.cjs");

async function main() {
    const pkg = readPkg();
    // The rename only happens once, so it also marks whether the one-time prompts below should run.
    const isFirstRun = pkg.name === "react-client-template";

    setPackageName(pkg);

    if (isFirstRun) {
        await setupStyling(pkg);
        await setupDesignSystem(pkg);
        await setupStateManagement(pkg);
        // The one-time scripts remove themselves below; this permanent one takes over postinstall.
        pkg.scripts = pkg.scripts ?? {};
        pkg.scripts.postinstall = "node scripts/codebase-memory-check.cjs";
    }

    writePkg(pkg);
    closePrompt();

    if (isFirstRun) {
        console.log("\nDependencies added to package.json — run `npm install` to finish setup.\n");
        // Scaffolding choices are now baked into the project; the one-time scripts have nothing left to do.
        fs.rmSync(path.join(root, "scripts", "postinstall"), { recursive: true, force: true });
        await require("../codebase-memory-check.cjs").run();
    }
}


void main();
