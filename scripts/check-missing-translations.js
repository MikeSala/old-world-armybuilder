#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function checkArmyUnits(filename) {
  const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
  const units = [];

  ['characters', 'core', 'special', 'rare'].forEach(cat => {
    if (data[cat]) {
      data[cat].forEach(unit => {
        units.push({
          category: cat,
          name_en: unit.name_en,
          has_pl: !!unit.name_pl
        });
      });
    }
  });

  return units;
}

const armies = [
  'daemons-of-chaos',
  'wood-elf-realms',
  'renegade-crowns'
];

const unitsDir = path.join(__dirname, '..', 'lib', 'data', 'domain', 'units');

armies.forEach(army => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${army.toUpperCase()}`);
  console.log('='.repeat(60));

  const units = checkArmyUnits(path.join(unitsDir, `${army}.json`));
  const withoutPl = units.filter(u => !u.has_pl);
  const withPl = units.filter(u => u.has_pl);

  console.log(`Total units: ${units.length}`);
  console.log(`With name_pl: ${withPl.length}`);
  console.log(`Without name_pl: ${withoutPl.length}`);

  if (withoutPl.length > 0) {
    console.log('\nUnits needing translation:');
    withoutPl.forEach(u => {
      console.log(`  [${u.category.toUpperCase().padEnd(10)}] ${u.name_en}`);
    });
  }
});
