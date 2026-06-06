const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '..', 'src', 'main.js');
let mainContent = fs.readFileSync(mainJsPath, 'utf8');

// Find the allergenData array
const startIdx = mainContent.indexOf('const allergenData = [');
if (startIdx === -1) {
  console.error("Could not find start of allergenData");
  process.exit(1);
}

// Find the corresponding closing bracket by scanning
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

if (endIdx === -1) {
  console.error("Could not find end of allergenData");
  process.exit(1);
}

const arrayStr = mainContent.slice(startIdx + 'const allergenData = '.length, endIdx);
const allergenData = eval(arrayStr);

console.log('Original allergenData length:', allergenData.length);

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

function mergeAllergens(a, b) {
  const merged = { ...a };
  for (const [key, val] of Object.entries(b)) {
    const current = merged[key];
    if (val === 'Yes' || current === 'Yes') {
      merged[key] = 'Yes';
    } else if (val === 'May' || current === 'May') {
      merged[key] = 'May';
    } else {
      merged[key] = 'No';
    }
  }
  return merged;
}

const deduplicatedAllergenData = [];
const nameToItemMap = new Map();

allergenData.forEach(item => {
  const canonicalName = canonicalMap[item.name] || item.name;
  if (nameToItemMap.has(canonicalName)) {
    const existing = nameToItemMap.get(canonicalName);
    existing.allergens = mergeAllergens(existing.allergens, item.allergens);
  } else {
    const newItem = {
      name: canonicalName,
      allergens: { ...item.allergens }
    };
    nameToItemMap.set(canonicalName, newItem);
    deduplicatedAllergenData.push(newItem);
  }
});

console.log('Deduplicated allergenData length:', deduplicatedAllergenData.length);

const testItems = [
  "Ten Wings",
  "Three Wings",
  "Five Wings",
  "Chit-Chats & Chicken",
  "Kickin' In Kenya",
  "We Meat Again",
  "Prawn To Be Wild",
  "J2O",
  "Juices",
  "Fruit Shoot"
];

testItems.forEach(name => {
  const matches = deduplicatedAllergenData.filter(i => i.name === name);
  console.log(`Item: "${name}", Count: ${matches.length}`);
});
