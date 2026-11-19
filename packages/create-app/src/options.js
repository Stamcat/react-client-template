// Single source of truth for the CLI's choice menus and the valid (architecture, styling, state,
// design-system) combination space — consumed by index.js's prompts and by CI's matrix generator.

export const ARCHITECTURE_OPTIONS = [
    { label: "React (Vite SPA)", value: "vite" },
    { label: "Next.js (Pages Router)", value: "nextjs" },
    { label: "React Server Components (Next.js App Router)", value: "rsc" },
];

// Emotion is vite-only by design: CSS-in-JS doesn't play well with Next.js/RSC server rendering.
export const STYLING_ARCHITECTURES = {
    none: ["vite", "nextjs", "rsc"],
    sass: ["vite", "nextjs", "rsc"],
    "css-modules": ["vite", "nextjs", "rsc"],
    tailwind: ["vite", "nextjs", "rsc"],
    emotion: ["vite"],
};

export const STYLING_OPTIONS = [
    { label: "None — create your own", value: "none" },
    { label: "SCSS Modules", value: "sass" },
    { label: "CSS Modules", value: "css-modules" },
    { label: "Tailwind CSS", value: "tailwind" },
    { label: "Emotion (@emotion/styled + @emotion/react)", value: "emotion" },
];

export const STATE_OPTIONS = [
    { label: "Redux Toolkit + redux-saga", value: "redux-saga" },
    { label: "Redux Toolkit + thunk", value: "redux-thunk" },
    { label: "None — bring your own", value: "none" },
];

export const DESIGN_SYSTEM_OPTIONS = [
    { label: "@stamcat/craftsman", value: "craftsman" },
    { label: "@stamcat/chadman", value: "chadman" },
    { label: "None (I will install my own)", value: "none" },
];

export function getValidCombinations() {
    const combinations = [];
    for (const { value: architecture } of ARCHITECTURE_OPTIONS) {
        for (const { value: styling } of STYLING_OPTIONS) {
            if (!STYLING_ARCHITECTURES[styling].includes(architecture)) continue;
            for (const { value: state } of STATE_OPTIONS) {
                for (const { value: designSystem } of DESIGN_SYSTEM_OPTIONS) {
                    combinations.push({ architecture, styling, state, designSystem });
                }
            }
        }
    }
    return combinations;
}
