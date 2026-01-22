#!/usr/bin/env node

/**
 * Script to add name_pl translations to unit JSON files
 * Usage: node scripts/add-pl-translations.js
 */

const fs = require('fs');
const path = require('path');

// Key units to translate for Warriors of Chaos
const translations = {
  // Characters
  "Daemon Prince {warriors of chaos}": "Książę Demonów {warriors of chaos}",
  "Daemon Prince": "Książę Demonów",
  "Chaos Lord": "Władca Chaosu",
  "Sorcerer Lord": "Władca Czarnoksiężników",
  "Exalted Hero": "Wywyższony Bohater",
  "Chaos Sorcerer": "Czarnoksiężnik Chaosu",

  // Core
  "Chaos Warriors": "Wojownicy Chaosu",
  "Chaos Marauders": "Maruderzy Chaosu",
  "Chaos Warhounds": "Bojowe Psy Chaosu",
  "Marauder Horsemen": "Konni Maruderzy",

  // Special
  "Chosen Chaos Warriors": "Wybrańcy Chaosu",
  "Chaos Knights": "Rycerze Chaosu",
  "Chaos Trolls": "Trolle Chaosu",
  "Chaos Ogres": "Ogry Chaosu",
  "Gorebeast Chariot": "Rydwan Bestii Krwi",

  // Rare
  "Chosen Chaos Knights": "Wybrańcy Rycerze",
  "Chaos Warshrine": "Świątynia Wojenna Chaosu",
  "Dragon Ogres": "Smocze Ogry",
  "Chaos Spawn": "Pomiot Chaosu",
  "Hellcannon": "Piekielna Armata"
};

function addTranslationsToFile(filePath) {
  console.log(`Processing: ${filePath}`);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    let modifiedCount = 0;

    // Process all categories
    for (const category of ['characters', 'core', 'special', 'rare']) {
      if (!data[category]) continue;

      for (const unit of data[category]) {
        const nameEn = unit.name_en;

        // Skip if already has name_pl
        if (unit.name_pl) continue;

        // Check if we have a translation
        if (translations[nameEn]) {
          // Insert name_pl right after name_en
          const keys = Object.keys(unit);
          const nameEnIndex = keys.indexOf('name_en');

          if (nameEnIndex !== -1) {
            const newUnit = {};
            keys.forEach((key, index) => {
              newUnit[key] = unit[key];
              if (index === nameEnIndex) {
                newUnit.name_pl = translations[nameEn];
              }
            });

            Object.keys(unit).forEach(key => delete unit[key]);
            Object.keys(newUnit).forEach(key => unit[key] = newUnit[key]);

            modifiedCount++;
            console.log(`  ✓ Added translation for: ${nameEn} → ${translations[nameEn]}`);
          }
        }
      }
    }

    if (modifiedCount > 0) {
      // Write back with proper formatting
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`✓ Modified ${modifiedCount} units in ${path.basename(filePath)}\n`);
    } else {
      console.log(`  No changes needed\n`);
    }

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process Warriors of Chaos file
const unitsDir = path.join(__dirname, '..', 'lib', 'data', 'domain', 'units');
const warriorsFile = path.join(unitsDir, 'warriors-of-chaos.json');

if (fs.existsSync(warriorsFile)) {
  addTranslationsToFile(warriorsFile);
  console.log('✓ Translation script completed!');
} else {
  console.error('Error: warriors-of-chaos.json not found');
  process.exit(1);
}
