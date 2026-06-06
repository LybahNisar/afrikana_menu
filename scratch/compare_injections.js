const fs = require('fs');
const path = require('path');

const scratchDir = 'C:\\Users\\GEO\\.gemini\\antigravity\\brain\\ad275575-6894-4570-bd7f-60b95149532c\\scratch';
const files = fs.readdirSync(scratchDir);

const injectedNames = new Set();

files.forEach(file => {
  if (file.startsWith('inject_') && file.endsWith('.js')) {
    const content = fs.readFileSync(path.join(scratchDir, file), 'utf8');
    
    // Find name fields
    const nameMatches = content.matchAll(/name:\s*"([^"]+)"/g);
    for (const match of nameMatches) {
      injectedNames.add(match[1]);
    }
  }
});

console.log('Total unique names in injection scripts:', injectedNames.size);
console.log('List of unique names in injection scripts:');
console.log(Array.from(injectedNames).sort());
