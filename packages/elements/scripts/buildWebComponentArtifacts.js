const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const packageLicense = path.resolve(__dirname, '..', 'LICENSE');
const packageNotice = path.resolve(__dirname, '..', 'NOTICE');
const legacyWebComponentsBundle = path.join(distDir, 'web-components.min.js');
const legacyWebComponentsBundleLicense = path.join(distDir, 'web-components.min.js.LICENSE.txt');
const namedWebComponentsBundle = path.join(distDir, 'elements-web-components.min.js');
const namedWebComponentsBundleLicense = path.join(distDir, 'elements-web-components.min.js.LICENSE.txt');
const scopedStylesheet = path.join(distDir, 'elements-web-components.min.scoped.css');
const distLicense = path.join(distDir, 'LICENSE');
const distNotice = path.join(distDir, 'NOTICE');

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Expected build artifact to exist: ${filePath}`);
  }
}

assertExists(legacyWebComponentsBundle);
assertExists(legacyWebComponentsBundleLicense);
assertExists(scopedStylesheet);
assertExists(packageLicense);
assertExists(packageNotice);

fs.copyFileSync(legacyWebComponentsBundle, namedWebComponentsBundle);
fs.copyFileSync(legacyWebComponentsBundleLicense, namedWebComponentsBundleLicense);
fs.copyFileSync(packageLicense, distLicense);
fs.copyFileSync(packageNotice, distNotice);

const bundleContents = fs
  .readFileSync(namedWebComponentsBundle, 'utf8')
  .replace('web-components.min.js.LICENSE.txt', 'elements-web-components.min.js.LICENSE.txt');

fs.writeFileSync(namedWebComponentsBundle, bundleContents);

console.log('Created web-component artifacts:');
console.log(`- ${path.relative(process.cwd(), namedWebComponentsBundle)}`);
console.log(`- ${path.relative(process.cwd(), namedWebComponentsBundleLicense)}`);
console.log(`- ${path.relative(process.cwd(), scopedStylesheet)}`);
console.log(`- ${path.relative(process.cwd(), distLicense)}`);
console.log(`- ${path.relative(process.cwd(), distNotice)}`);
