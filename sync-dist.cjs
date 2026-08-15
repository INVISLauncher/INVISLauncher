const fs = require('fs');
const path = require('path');

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('--- Syncing dist to root for GitHub Pages ---');

// 1. Copy dist/index.html to ./index.html
if (fs.existsSync('dist/index.html')) {
  fs.copyFileSync('dist/index.html', 'index.html');
  console.log('✓ Copied dist/index.html -> ./index.html');
}

// 2. Clean root assets folder and copy dist/assets to ./assets
if (fs.existsSync('dist/assets')) {
  if (fs.existsSync('assets')) {
    fs.rmSync('assets', { recursive: true, force: true });
  }
  copyDirSync('dist/assets', 'assets');
  console.log('✓ Replaced ./assets with dist/assets');
}

// 3. Ensure .nojekyll is present in root
fs.writeFileSync('.nojekyll', '');
console.log('✓ Ensured .nojekyll in root');

console.log('--- Sync complete! Root is now identical to dist ---');
