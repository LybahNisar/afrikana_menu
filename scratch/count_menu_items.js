const fs = require('fs');
const path = require('path');

// 1. Read index.html
const htmlPath = path.join(__dirname, '..', 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Use regexes or JSDOM to parse menu items.
// Since index.html has a structured menu, let's count occurrences of items.
// Let's search for unique headings/names in cards, platter-cards, and list-rows.
// In the menu, items are usually defined in:
// - h5 tags inside cards: <h5>Name</h5>
// - h4/h5 tags in platter-cards: <h3>Name</h3> or <h4>Name</h4>
// Let's analyze occurrences of card titles.
// Let's write a simple extraction.

const uniqueHtmlItems = new Set();

// Regular expressions to match item names in cards, list rows, platters
// 1) Small Bites / Chicken / Burgers / Specials / Sides / Kids / Desserts cards:
//    Typically: <h5>Item Name</h5> inside a card
const cardHeadingRegex = /<h5>([^<]+)<\/h5>/g;
let match;
while ((match = cardHeadingRegex.exec(htmlContent)) !== null) {
  const name = match[1].trim();
  // Filter out headers that are not menu items if any
  if (name && !name.includes('Contains') && !name.includes('May Contain') && !name.includes('Safe')) {
    uniqueHtmlItems.add(name);
  }
}

// 2) Platter card titles (usually <h3> or <h4>)
const platterHeadingRegex = /<h3>([^<]+)<\/h3>/g;
while ((match = platterHeadingRegex.exec(htmlContent)) !== null) {
  const name = match[1].trim();
  if (name && name !== 'Afrikana' && name !== 'Menu' && name !== 'Allergens') {
    uniqueHtmlItems.add(name);
  }
}

// Let's also check htmlMapping in main.js
const mainJsPath = path.join(__dirname, '..', 'src', 'main.js');
const mainContent = fs.readFileSync(mainJsPath, 'utf8');

// Load allergenData array
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

// Load canonicalMap and run deduplication
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

const uniqueAllergens = new Set();
allergenData.forEach(item => {
  const canonicalName = canonicalMap[item.name] || item.name;
  uniqueAllergens.add(canonicalName);
});

console.log('HTML unique item count parsed:', uniqueHtmlItems.size);
console.log('Allergen raw data items count:', allergenData.length);
console.log('Allergen deduplicated items count:', uniqueAllergens.size);

// Print items that are in html but not in allergen list
const htmlItemsArr = Array.from(uniqueHtmlItems);
const missingInAllergens = htmlItemsArr.filter(item => !uniqueAllergens.has(item));
console.log('Items on HTML menu:', htmlItemsArr.length);
console.log('Items in Allergen list:', uniqueAllergens.size);
