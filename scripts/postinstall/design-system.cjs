// Prompts for an optional design-system package on first install.
const { addDependency, getLatestVersion, promptChoice } = require("./utils.cjs");

async function setupDesignSystem(pkg) {
    const question = [
        "",
        "Install a design system?",
        "  1) @stamcat/craftsman",
        "  2) @stamcat/chadman",
        "  3) None (I will install my own)",
        "Enter a number [3]: ",
    ].join("\n");
    const choice = await promptChoice(question, { defaultValue: "3" });

    if (choice === "1") {
        addDependency(pkg, "@stamcat/craftsman", getLatestVersion("@stamcat/craftsman", "0.1.18"));
    } else if (choice === "2") {
        addDependency(pkg, "@stamcat/chadman", getLatestVersion("@stamcat/chadman", "0.0.1-alpha.4"));
    }
}

module.exports = { setupDesignSystem };
