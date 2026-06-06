const fs = require('fs');
const path = require('path');

const scratchDir = 'C:\\Users\\GEO\\.gemini\\antigravity\\brain\\ad275575-6894-4570-bd7f-60b95149532c\\scratch';
const files = fs.readdirSync(scratchDir);

const injectFiles = [
  'inject_burgers_allergens.js',
  'inject_desserts_allergens.js',
  'inject_drinks_allergens.js',
  'inject_kids_sides.js',
  'inject_mocktails_allergens.js',
  'inject_specials_allergens.js'
];

let totalEntriesInInjectScripts = 0;
const allNames = [];

injectFiles.forEach(file => {
  const filePath = path.join(scratchDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // We want to count how many objects are declared in the arrays inside these files.
    // They usually look like: name: "Item Name", or name: 'Item Name'
    const nameMatches = content.match(/name:\s*["']([^"']+)["']/g);
    if (nameMatches) {
      console.log(`${file}: found ${nameMatches.length} items`);
      totalEntriesInInjectScripts += nameMatches.length;
      nameMatches.forEach(m => {
        const name = m.replace(/name:\s*["']/, '').replace(/["']/, '');
        allNames.push({ file, name });
      });
    } else {
      console.log(`${file}: no names matched`);
    }
  } else {
    console.log(`${file}: file does not exist`);
  }
});

console.log('Total entries across injection scripts:', totalEntriesInInjectScripts);

// Group by name to find duplicates in the original scripts
const nameGroups = {};
allNames.forEach(item => {
  if (!nameGroups[item.name]) nameGroups[item.name] = [];
  nameGroups[item.name].push(item.file);
});

console.log('\nDuplicate items originally present across these injection scripts:');
let duplicateCount = 0;
Object.entries(nameGroups).forEach(([name, sources]) => {
  if (sources.length > 1) {
    console.log(` - "${name}": present in [${sources.join(', ')}]`);
    duplicateCount++;
  }
});
console.log('Number of cross-file duplicates:', duplicateCount);
