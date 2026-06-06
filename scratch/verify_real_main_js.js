const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '..', 'src', 'main.js');
let mainContent = fs.readFileSync(mainJsPath, 'utf8');

// We will parse the key parts and run them inside one script string
const startAllgIdx = mainContent.indexOf('const allergenData = [');
let braceCount = 0;
let endAllgIdx = -1;
for (let i = startAllgIdx + 'const allergenData = '.length; i < mainContent.length; i++) {
  if (mainContent[i] === '[') braceCount++;
  if (mainContent[i] === ']') {
    braceCount--;
    if (braceCount === 0) {
      endAllgIdx = i + 1;
      break;
    }
  }
}
const allergenDataStr = mainContent.slice(startAllgIdx, endAllgIdx);

const startDedupIdx = mainContent.indexOf('// ── PROGRAMMATIC DEDUPLICATION & NORMALIZATION ──');
const endDedupIdx = mainContent.indexOf('// Tab Switching');
const dedupStr = mainContent.slice(startDedupIdx, endDedupIdx);

const startHtmlIdx = mainContent.indexOf('const htmlMapping = {');
let braceCount2 = 0;
let endHtmlIdx = -1;
for (let i = startHtmlIdx + 'const htmlMapping = '.length; i < mainContent.length; i++) {
  if (mainContent[i] === '{') braceCount2++;
  if (mainContent[i] === '}') {
    braceCount2--;
    if (braceCount2 === 0) {
      endHtmlIdx = i + 1;
      break;
    }
  }
}
const htmlMappingStr = mainContent.slice(startHtmlIdx, endHtmlIdx);

const fullScript = `
${allergenDataStr}
${htmlMappingStr}
${dedupStr}

console.log('Evaluated allergenData size:', allergenData.length);
console.log('Evaluated htmlMapping size:', Object.keys(htmlMapping).length);

const missing = [];
Object.keys(htmlMapping).forEach(key => {
  const match = allergenData.find(item => item.name === key);
  if (!match) {
    missing.push(key);
  }
});
console.log('Items missing in final evaluated list:', missing);
`;

eval(fullScript);
