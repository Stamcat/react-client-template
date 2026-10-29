// Renames package.json's "name" to the project folder name after this template is copied/cloned.
const fs = require("node:fs");
const path = require("node:path");
const { root } = require("./utils.cjs");

function setPackageName(pkg) {
    // Only runs once: skip if a consumer already renamed the package (not the template default).
    if (pkg.name !== "react-client-template") {
        return;
    }

    const folderName = path.basename(root);
    const newName = folderName
        .toLowerCase()
        .replace(/[^a-z0-9-~]+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");

    if (!newName || newName === "react-client-template") {
        return;
    }

    pkg.name = newName;

    const lockPath = path.join(root, "package-lock.json");
    if (fs.existsSync(lockPath)) {
        const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
        lock.name = newName;
        if (lock.packages?.[""]) {
            lock.packages[""].name = newName;
        }
        fs.writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
    }

    const docEdits = [
        ["README.md", "# react-client-template", `# ${newName}`],
        ["AGENTS.md", "# Agent Instructions — react-client-template", `# Agent Instructions — ${newName}`],
        [
            path.join(".github", "copilot-instructions.md"),
            "# Copilot instructions — react-client-template",
            `# Copilot instructions — ${newName}`,
        ],
    ];
    for (const [relPath, from, to] of docEdits) {
        const docPath = path.join(root, relPath);
        if (!fs.existsSync(docPath)) continue;
        const contents = fs.readFileSync(docPath, "utf8");
        if (contents.includes(from)) {
            fs.writeFileSync(docPath, contents.replace(from, to));
        }
    }

    console.log(`package.json name set to "${newName}"`);
}

module.exports = { setPackageName };
