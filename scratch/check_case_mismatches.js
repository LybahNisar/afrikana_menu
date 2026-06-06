const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '..', 'src', 'main.js');
const mainContent = fs.readFileSync(mainJsPath, 'utf8');

// Find htmlMapping
const startHtmlIdx = mainContent.indexOf('const htmlMapping = {');
let braceCount = 0;
let endHtmlIdx = -1;
for (let i = startHtmlIdx + 'const htmlMapping = '.length; i < mainContent.length; i++) {
  if (mainContent[i] === '{') braceCount++;
  if (mainContent[i] === '}') {
    braceCount--;
    if (braceCount === 0) {
      endHtmlIdx = i + 1;
      break;
    }
  }
}
const htmlMapping = eval('(' + mainContent.slice(startHtmlIdx + 'const htmlMapping = '.length, endHtmlIdx) + ')');

// Load allergenData array
const startAllgIdx = mainContent.indexOf('const allergenData = [');
let braceCount2 = 0;
let endAllgIdx = -1;
for (let i = startAllgIdx + 'const allergenData = '.length; i < mainContent.length; i++) {
  if (mainContent[i] === '[') braceCount2++;
  if (mainContent[i] === ']') {
    braceCount2--;
    if (braceCount2 === 0) {
      endAllgIdx = i + 1;
      break;
    }
  }
}
const allergenData = eval(mainContent.slice(startAllgIdx + 'const allergenData = '.length, endAllgIdx));

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

const allergenNamesLower = new Map();
allergenData.forEach(item => {
  const canonicalName = canonicalMap[item.name] || item.name;
  allergenNamesLower.set(canonicalName.toLowerCase(), canonicalName);
});

Object.keys(htmlMapping).forEach(menuItem => {
  const lower = menuItem.toLowerCase();
  if (allergenNamesLower.has(lower)) {
    const matchedName = allergenNamesLower.get(lower);
    if (matchedName !== menuItem) {
      console.log(`Mismatch: HTML is "${menuItem}", Allergen is "${matchedName}"`);
    }
  } else {
    console.log(`Truly missing from Allergen: "${menuItem}"`);
  }
});
