// Renames package.json's "name" to the project folder name after this template is copied/cloned.
const fs = require('node:fs');
const path = require('node:path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// Only runs once: skip if a consumer already renamed the package (not the template default).
if (pkg.name !== 'react-client-template') {
  process.exit(0);
}

const folderName = path.basename(path.join(__dirname, '..'));
const newName = folderName
  .toLowerCase()
  .replace(/[^a-z0-9-~]+/g, '-')
  .replace(/^-+|-+$/g, '');

if (!newName || newName === 'react-client-template') {
  process.exit(0);
}

pkg.name = newName;
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
console.log(`package.json name set to "${newName}"`);
