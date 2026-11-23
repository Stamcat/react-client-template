// Needed for babel-jest to down-compile ESM-only compiled library code under node_modules.
module.exports = {
    presets: [["@babel/preset-env", { targets: { node: "current" } }]],
};
