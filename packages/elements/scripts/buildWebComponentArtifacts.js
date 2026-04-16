const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const legacyWebComponentsBundle = path.join(distDir, 'web-components.min.js');
const legacyWebComponentsBundleLicense = path.join(distDir, 'web-components.min.js.LICENSE.txt');
const namedWebComponentsBundle = path.join(distDir, 'elements-web-components.min.js');
const namedWebComponentsBundleLicense = path.join(distDir, 'elements-web-components.min.js.LICENSE.txt');
const scopedStylesheet = path.join(distDir, 'elements-web-components.min.scoped.css');

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Expected build artifact to exist: ${filePath}`);
  }
}

assertExists(legacyWebComponentsBundle);
assertExists(legacyWebComponentsBundleLicense);
assertExists(scopedStylesheet);

fs.copyFileSync(legacyWebComponentsBundle, namedWebComponentsBundle);
fs.copyFileSync(legacyWebComponentsBundleLicense, namedWebComponentsBundleLicense);

const bundleContents = fs
  .readFileSync(namedWebComponentsBundle, 'utf8')
  .replace('web-components.min.js.LICENSE.txt', 'elements-web-components.min.js.LICENSE.txt');

fs.writeFileSync(namedWebComponentsBundle, bundleContents);

console.log('Created web-component artifacts:');
console.log(`- ${path.relative(process.cwd(), namedWebComponentsBundle)}`);
console.log(`- ${path.relative(process.cwd(), namedWebComponentsBundleLicense)}`);
console.log(`- ${path.relative(process.cwd(), scopedStylesheet)}`);
