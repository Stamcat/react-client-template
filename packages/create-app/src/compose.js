// Layer composition: copies template directories into the target in order, last layer wins on path collisions.
import fs from "node:fs/promises";
import path from "node:path";

// These files carry data consumed by compose.js itself, not files to copy verbatim into the project.
const NON_COPYABLE = new Set(["deps.json", "scripts.json", "package.json.template"]);

async function copyDir(srcDir, destDir) {
    // Env-var overrides skip the menu's architecture-aware filtering, so a mismatched combo
    // (e.g. styling=tailwind with architecture=nextjs) must not exist yet — skip it rather than crash.
    let entries;
    try {
        entries = await fs.readdir(srcDir, { withFileTypes: true });
    } catch {
        return;
    }
    for (const entry of entries) {
        if (NON_COPYABLE.has(entry.name)) continue;
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);
        if (entry.isDirectory()) {
            await fs.mkdir(destPath, { recursive: true });
            await copyDir(srcPath, destPath);
        } else {
            await fs.mkdir(path.dirname(destPath), { recursive: true });
            await fs.copyFile(srcPath, destPath);
        }
    }
}

async function readJsonIfExists(filePath, fallback) {
    try {
        return JSON.parse(await fs.readFile(filePath, "utf8"));
    } catch {
        return fallback;
    }
}

function mergeDeps(target, addition) {
    for (const bucket of ["dependencies", "devDependencies"]) {
        if (!addition[bucket]) continue;
        target[bucket] = { ...target[bucket], ...addition[bucket] };
    }
}

function sortDeps(pkg) {
    for (const bucket of ["dependencies", "devDependencies"]) {
        if (!pkg[bucket]) continue;
        pkg[bucket] = Object.fromEntries(Object.entries(pkg[bucket]).sort(([a], [b]) => a.localeCompare(b)));
    }
}// Composes the given layer directories (in order) into targetDir, then writes the merged package.json.
export async function composeLayers({ layerDirs, basePkgTemplatePath, targetDir, projectName }) {
    for (const layerDir of layerDirs) {
        await copyDir(layerDir, targetDir);
    }

    const pkg = JSON.parse((await fs.readFile(basePkgTemplatePath, "utf8")).replaceAll("{{projectName}}", projectName));
    for (const layerDir of layerDirs) {
        const scripts = await readJsonIfExists(path.join(layerDir, "scripts.json"), null);
        if (scripts) pkg.scripts = { ...pkg.scripts, ...scripts };

        const deps = await readJsonIfExists(path.join(layerDir, "deps.json"), null);
        if (deps) mergeDeps(pkg, deps);
    }
    sortDeps(pkg);
    pkg.scripts = Object.fromEntries(Object.entries(pkg.scripts).sort(([a], [b]) => a.localeCompare(b)));

    await fs.writeFile(path.join(targetDir, "package.json"), `${JSON.stringify(pkg, null, 2)}\n`);
}

// Interpolates {{projectName}} into the handful of copied docs that reference it by name.
export async function renderProjectName(targetDir, projectName) {
    const docPaths = ["AGENTS.md", "README.md", path.join(".github", "copilot-instructions.md")];
    for (const relPath of docPaths) {
        const filePath = path.join(targetDir, relPath);
        const contents = await readFileIfExists(filePath);
        if (contents === null) continue;
        await fs.writeFile(filePath, contents.replaceAll("{{projectName}}", projectName));
    }
}

async function readFileIfExists(filePath) {
    try {
        return await fs.readFile(filePath, "utf8");
    } catch {
        return null;
    }
}
