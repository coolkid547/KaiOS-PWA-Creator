const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'manifest.json');

function fail(msg){
  console.error('✖', msg);
  process.exitCode = 1;
}

if (!fs.existsSync(manifestPath)) {
  fail('manifest.json not found');
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch (e) {
  fail('manifest.json is not valid JSON: ' + e.message);
}

const required = ['name','short_name','start_url','icons'];
for (const k of required){
  if (!manifest[k]) fail(`manifest.json missing required key: ${k}`);
}

if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
  fail('manifest.json must include an icons array with at least one icon');
}

// Check that referenced icon files exist
for (const icon of manifest.icons){
  if (icon && icon.src){
    const iconPath = path.join(root, icon.src.replace(/^\//, ''));
    if (!fs.existsSync(iconPath)) {
      fail(`Icon file not found: ${icon.src} -> looked at ${iconPath}`);
    }
  }
}

console.log('✓ manifest.json looks valid and icons exist');
process.exit(process.exitCode || 0);
