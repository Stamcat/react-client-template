#!/usr/bin/env node
// Prints every valid (architecture, styling, state, designSystem) combination as a JSON array —
// consumed by the CI template-matrix workflow to build its job matrix.
import { getValidCombinations } from "../src/options.js";

console.log(JSON.stringify(getValidCombinations()));
