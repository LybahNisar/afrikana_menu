const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '..', 'src', 'main.js');
let mainContent = fs.readFileSync(mainJsPath, 'utf8');

// Find the allergenData array (we need to parse it before the deduplication code runs)
// Since we added deduplication code, we can read the raw array by extracting the bracket block.
const startIdx = mainContent.indexOf('const allergenData = [');
let braceCount = 0;
let endIdx = -1;
for (let i = startIdx + 'const allergenData = '.length; i < mainContent.length; i++) {
  if (mainContent[i] === '[') braceCount++;
  if (mainContent[i] === ']') {
    braceCount--;
    if (braceCount === 0) {
      endIdx = i + 1;
      break;
    }
  }
}

const arrayStr = mainContent.slice(startIdx + 'const allergenData = '.length, endIdx);
const allergenData = eval(arrayStr);

console.log('Original raw items in array:', allergenData.length);

const canonicalMap = {
  "10 Wings": "Ten Wings",
  "3 Wings": "Three Wings",
  "5 Wings": "Five Wings",
  "Platters - Chit-Chats & Chicken": "Chit-Chats & Chicken",
  "Platters - Kickin in Kenya": "Kickin' In Kenya",
  "Platters - We Meat Again": "We Meat Again",
  "Prawns To Be Wild": "Prawn To Be Wild",
  "Burgers - Slide In The DM's": "Slide In The DM's",
  "Burgers - Big Poppa": "Big Poppa",
  "Burgers - Bun True Love": "Bun True Love",
  "Burgers - Butterfly Bun": "Butterfly Bun",
  "Burgers - Meant To Bean": "Meant To Bean VE",
  "Burgers - Thic Chick": "Thic Chick",
  "Wrap - Edgy Veggie": "Edgy–Veggie Wrap V",
  "Wrap - That's a Wrap": "That's A Wrap",
  "Soft Drinks - Still Water": "Drip Still Water",
  "Soft Drinks - Sparkling Water": "Drip Sparkling Water",
  "Soft Drinks - Coca Cola": "Cola",
  "Soft Drinks - Coke Zero": "Diet Cola",
  "Soft Drinks - Diet Coke": "Diet Cola",
  "Soft Drinks - Irn Bru": "Irn Bru",
  "Soft Drinks - J20 Apple & Mango": "J2O",
  "Soft Drinks - J20 Apple & Raspberry": "J2O",
  "Soft Drinks - J20 Orange & Passion Fruit": "J2O",
  "Soft Drinks - Pineapple Juice": "Juices",
  "Soft Drinks - Apple Juice": "Juices",
  "Soft Drinks - Mango Juice": "Juices",
  "Soft Drinks - Orange Juice": "Juices",
  "Soft - Fruit Shoot Apple & Blackcurrant": "Fruit Shoot",
  "Soft - Fruit Shoot Orange": "Fruit Shoot"
};

// Check if any unique non-duplicate items are affected
const itemFrequency = {};
allergenData.forEach(item => {
  itemFrequency[item.name] = (itemFrequency[item.name] || 0) + 1;
});

console.log('\n--- Duplicate Names that existed directly in the raw list (before mapping) ---');
let duplicatesDirect = 0;
Object.entries(itemFrequency).forEach(([name, count]) => {
  if (count > 1) {
    console.log(` - "${name}": ${count} times`);
    duplicatesDirect += (count - 1);
  }
});
console.log('Total raw identical-name duplicates:', duplicatesDirect);

console.log('\n--- Mapping consolidation details ---');
const groupMap = {};
allergenData.forEach(item => {
  const canonicalName = canonicalMap[item.name] || item.name;
  if (!groupMap[canonicalName]) groupMap[canonicalName] = [];
  groupMap[canonicalName].push(item.name);
});

let consolidationCount = 0;
Object.entries(groupMap).forEach(([canonicalName, originalNames]) => {
  if (originalNames.length > 1) {
    console.log(`"${canonicalName}" consolidates: [${originalNames.join(', ')}]`);
    consolidationCount += (originalNames.length - 1);
  }
});
console.log('Total items consolidated by mapping:', consolidationCount);
console.log('Final unique list count:', Object.keys(groupMap).length);
