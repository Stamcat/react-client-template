// Interactive prompts for project generation. Menus list every option this CLI will eventually
// support; only the entries wired to a real template layer are selectable today.
import readline from "node:readline";

let sharedRl;
let autoYes = false;

export function setAutoYes(value) {
    autoYes = value;
}

function getRl() {
    sharedRl = sharedRl ?? readline.createInterface({ input: process.stdin, output: process.stdout });
    return sharedRl;
}

export function closePrompts() {
    sharedRl?.close();
}

function ask(question) {
    return new Promise((resolve) => getRl().question(question, (answer) => resolve(answer.trim())));
}

export async function promptText(question, { defaultValue } = {}) {
    if (autoYes || !process.stdin.isTTY) return defaultValue;
    const suffix = defaultValue ? ` [${defaultValue}]` : "";
    const answer = await ask(`${question}${suffix}: `);
    return answer || defaultValue;
}

// options: [{ label, value, implemented }]; unimplemented entries are shown but re-prompt if chosen.
export async function promptChoice(title, options, { defaultValue = "1" } = {}) {
    if (autoYes || !process.stdin.isTTY) return options[Number(defaultValue) - 1].value;

    const question = [
        "",
        title,
        ...options.map(({ label, implemented }, index) => `  ${index + 1}) ${label}${implemented ? "" : " (coming soon)"}`),
        `Enter a number [${defaultValue}]: `,
    ].join("\n");

    for (;;) {
        const answer = await ask(question);
        const choice = options[Number(answer || defaultValue) - 1];
        if (choice?.implemented) return choice.value;
        console.log(`\n"${choice?.label ?? answer}" isn't available yet — pick a different option.`);
    }
}
