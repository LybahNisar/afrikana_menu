const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '..', 'src', 'main.js');
const mainContent = fs.readFileSync(mainJsPath, 'utf8');

// Find the htmlMapping object
const startIdx = mainContent.indexOf('const htmlMapping = {');
if (startIdx === -1) {
  console.error("Could not find start of htmlMapping");
  process.exit(1);
}

let braceCount = 0;
let endIdx = -1;
for (let i = startIdx + 'const htmlMapping = '.length; i < mainContent.length; i++) {
  if (mainContent[i] === '{') braceCount++;
  if (mainContent[i] === '}') {
    braceCount--;
    if (braceCount === 0) {
      endIdx = i + 1;
      break;
    }
  }
}

const objectStr = mainContent.slice(startIdx + 'const htmlMapping = '.length, endIdx);
const htmlMapping = eval('(' + objectStr + ')');

console.log('Number of keys in htmlMapping:', Object.keys(htmlMapping).length);
console.log('Mapped HTML items:', Object.keys(htmlMapping).sort());
