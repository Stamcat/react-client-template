// Shared helpers for the one-time postinstall setup scripts.
const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");
const { execFileSync } = require("node:child_process");

const root = path.join(__dirname, "..", "..");
const isWindows = process.platform === "win32";

function readPkg() {
    return JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
}

function writePkg(pkg) {
    fs.writeFileSync(path.join(root, "package.json"), `${JSON.stringify(pkg, null, 2)}\n`);
}

function addDependency(pkg, name, version, { dev } = {}) {
    const bucket = dev ? "devDependencies" : "dependencies";
    pkg[bucket] = pkg[bucket] ?? {};
    pkg[bucket][name] = version;
    pkg[bucket] = Object.fromEntries(Object.entries(pkg[bucket]).sort(([a], [b]) => a.localeCompare(b)));
}

function removeDependency(pkg, name) {
    delete pkg.dependencies?.[name];
    delete pkg.devDependencies?.[name];
}

// Falls back to a known-good pin when offline or the registry can't be reached.
function getLatestVersion(name, fallback) {
    try {
        const version = execFileSync("npm", ["view", name, "version"], { encoding: "utf8", shell: isWindows }).trim();
        return version || fallback;
    } catch {
        console.warn(`\nCouldn't look up the latest version of ${name} — pinning ${fallback} instead.`);
        return fallback;
    }
}

// Single shared readline interface so each prompt doesn't reopen stdin.
let sharedRl;
function promptChoice(question, { defaultValue = "1" } = {}) {
    if (!process.stdin.isTTY) {
        return Promise.resolve(defaultValue);
    }
    sharedRl = sharedRl ?? readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        sharedRl.question(question, (answer) => resolve(answer.trim() || defaultValue));
    });
}

function closePrompt() {
    sharedRl?.close();
}

module.exports = {
    root,
    readPkg,
    writePkg,
    addDependency,
    removeDependency,
    getLatestVersion,
    promptChoice,
    closePrompt,
};
