const fs = require('fs');
const path = require('path');

const scratchDir = 'C:\\Users\\GEO\\.gemini\\antigravity\\brain\\ad275575-6894-4570-bd7f-60b95149532c\\scratch';
const files = fs.readdirSync(scratchDir);

const batchNames = new Set();

files.forEach(file => {
  if (file.startsWith('update_batch') && file.endsWith('.js')) {
    const content = fs.readFileSync(path.join(scratchDir, file), 'utf8');
    const nameMatches = content.matchAll(/name:\s*"([^"]+)"/g);
    for (const match of nameMatches) {
      batchNames.add(match[1]);
    }
  }
});

console.log('Total unique names in batch files:', batchNames.size);
console.log('Unique names in batch files:');
console.log(Array.from(batchNames).sort());
