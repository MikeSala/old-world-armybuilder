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

const unitsDir = path.join(__dirname, '..', 'lib', 'data', 'domain', 'units');
const files = fs.readdirSync(unitsDir).filter(f => f.endsWith('.json'));

console.log('=' .repeat(70));
console.log('TRANSLATION COVERAGE REPORT - ALL ARMIES');
console.log('='.repeat(70));
console.log();

const summary = [];
let totalUnits = 0;
let totalWithPl = 0;
let totalWithoutPl = 0;

files.forEach(file => {
  const armyName = path.basename(file, '.json');
  const units = checkArmyUnits(path.join(unitsDir, file));
  const withoutPl = units.filter(u => !u.has_pl);
  const withPl = units.filter(u => u.has_pl);

  totalUnits += units.length;
  totalWithPl += withPl.length;
  totalWithoutPl += withoutPl.length;

  summary.push({
    army: armyName,
    total: units.length,
    withPl: withPl.length,
    withoutPl: withoutPl.length,
    percentage: Math.round((withPl.length / units.length) * 100),
    missingUnits: withoutPl
  });
});

// Sort by number of missing translations (descending)
summary.sort((a, b) => b.withoutPl - a.withoutPl);

summary.forEach(s => {
  const status = s.withoutPl === 0 ? '✅' : '⚠️';
  const coverage = `${s.withPl}/${s.total}`;

  console.log(`${status} ${s.army.padEnd(35)} ${coverage.padStart(8)} (${s.percentage}%)`);

  if (s.withoutPl > 0) {
    s.missingUnits.forEach(u => {
      console.log(`     [${u.category.padEnd(10)}] ${u.name_en}`);
    });
    console.log();
  }
});

console.log('='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70));
console.log(`Total units across all armies: ${totalUnits}`);
console.log(`Units with name_pl: ${totalWithPl} (${Math.round((totalWithPl/totalUnits)*100)}%)`);
console.log(`Units without name_pl: ${totalWithoutPl} (${Math.round((totalWithoutPl/totalUnits)*100)}%)`);
console.log();

const armiesComplete = summary.filter(s => s.withoutPl === 0).length;
const armiesIncomplete = summary.filter(s => s.withoutPl > 0).length;

console.log(`Armies 100% complete: ${armiesComplete}/${files.length}`);
console.log(`Armies needing work: ${armiesIncomplete}/${files.length}`);
console.log();
