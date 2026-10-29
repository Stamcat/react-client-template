// Permanent postinstall hook: offers to install codebase-memory-mcp and index this repo for it.
const { spawnSync } = require("node:child_process");
const readline = require("node:readline");
const path = require("node:path");

const root = path.join(__dirname, "..");
const BIN = "codebase-memory-mcp";
const isWindows = process.platform === "win32";

function isInstalled() {
    const result = spawnSync(BIN, ["--version"], { stdio: "ignore", shell: isWindows });
    return !result.error;
}

function ask(question) {
    if (!process.stdin.isTTY) {
        return Promise.resolve(false);
    }
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(/^y(es)?$/i.test(answer.trim()));
        });
    });
}

function install() {
    if (isWindows) {
        console.log(
            "\nRun the following in PowerShell to install codebase-memory-mcp, then run `npm install` again:\n" +
                "  Invoke-WebRequest -Uri https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.ps1 -OutFile install.ps1; .\\install.ps1\n",
        );
        return false;
    }
    const result = spawnSync(
        "bash",
        ["-c", "curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash"],
        { stdio: "inherit" },
    );
    return result.status === 0;
}

function indexRepo() {
    spawnSync(BIN, ["cli", "index_repository", `--repo-path=${root}`], { stdio: "inherit", shell: isWindows });
}

async function run() {
    if (isInstalled()) {
        const shouldIndex = await ask(
            "\nIndex this repository with codebase-memory-mcp now for richer AI agent context? [y/N] ",
        );
        if (shouldIndex) {
            indexRepo();
        }
        return;
    }

    const shouldInstall = await ask(
        "\ncodebase-memory-mcp isn't installed. Install it now to give AI coding agents richer, graph-based context on this codebase? [y/N] ",
    );
    if (!shouldInstall) {
        return;
    }
    if (install()) {
        indexRepo();
    }
}

if (require.main === module) {
    void run();
}

module.exports = { run };
