#!/usr/bin/env node

/**
 * Comprehensive script to add name_pl translations to all army unit JSON files
 * Usage: node scripts/translate-all-armies.js [army-name]
 *
 * Examples:
 *   node scripts/translate-all-armies.js                    # Process all armies
 *   node scripts/translate-all-armies.js empire-of-man      # Process single army
 */

const fs = require('fs');
const path = require('path');

// Centralized translation database for all armies
const TRANSLATIONS = {
  // ===== WARRIORS OF CHAOS =====
  "Daemon Prince {warriors of chaos}": "Książę Demonów {warriors of chaos}",
  "Daemon Prince": "Książę Demonów",
  "Chaos Lord": "Władca Chaosu",
  "Sorcerer Lord": "Władca Czarnoksiężników",
  "Exalted Hero": "Wywyższony Bohater",
  "Chaos Sorcerer": "Czarnoksiężnik Chaosu",
  "Chaos Warriors": "Wojownicy Chaosu",
  "Chaos Marauders": "Maruderzy Chaosu",
  "Chaos Warhounds": "Bojowe Psy Chaosu",
  "Marauder Horsemen": "Konni Maruderzy",
  "Chosen Chaos Warriors": "Wybrani Wojownicy Chaosu",
  "Chaos Knights": "Rycerze Chaosu",
  "Chaos Trolls": "Trolle Chaosu",
  "Chaos Ogres": "Ogry Chaosu",
  "Gorebeast Chariot": "Rydwan Bestii Krwi",
  "Chosen Chaos Knights": "Wybrani Rycerze Chaosu",
  "Chaos Warshrine": "Świątynia Wojenna Chaosu",
  "Dragon Ogres": "Smocze Ogry",
  "Chaos Spawn": "Pomiot Chaosu",
  "Hellcannon": "Piekielna Armata",

  // ===== BEASTMEN BRAYHERDS =====
  "Beastlord": "Pan Bestii",
  "Great Bray-Shaman": "Wielki Braillechaman",
  "Wargor": "Wargor",
  "Bray-Shaman": "Braillechaman",
  "Gorebull": "Gorebull",
  "Gor Herd": "Stado Gorów",
  "Ungor Herd": "Stado Ungorów",
  "Ungor Raiders": "Najeźdźcy Ungorzy",
  "Chaos Warhounds {beastmen-brayherds}": "Bojowe Psy Chaosu {beastmen-brayherds}",
  "Bestigor Herd": "Stado Bestigorów",
  "Minotaurs": "Minotaury",
  "Centigors": "Centigorzy",
  "Tuskgor Chariot": "Rydwan Tuskgora",
  "Chaos Spawn {beastmen-brayherds}": "Pomiot Chaosu {beastmen-brayherds}",
  "Giant": "Olbrzym",
  "Ghorgon": "Ghorgon",
  "Cygor": "Cygor",

  // ===== EMPIRE OF MAN =====
  "General of the Empire": "Generał Imperium",
  "Grand Master": "Wielki Mistrz",
  "Battle Wizard Lord": "Władca Czarodziejów Bitewnych",
  "Captain of the Empire": "Kapitan Imperium",
  "Battle Wizard": "Czarodziej Bitewny",
  "Warrior Priest": "Kapłan Wojownik",
  "Master Engineer": "Mistrz Inżynier",
  "Halberdiers": "Halabardnicy",
  "Swordsmen": "Mieczownicy",
  "Spearmen": "Włócznicy",
  "Free Company": "Wolna Kompania",
  "Handgunners": "Arkebuzjerzy",
  "Crossbowmen": "Kusznicy",
  "Huntsmen": "Łowcy",
  "Flagellants": "Flagelanci",
  "Greatswords": "Mieczownicy Olbrzymów",
  "Knights of the Empire": "Rycerze Imperium",
  "Pistoliers": "Pistoletnicy",
  "Outriders": "Zwiadowcy",
  "Demigryph Knights": "Rycerze na Demigryfach",
  "Great Cannon": "Wielka Armata",
  "Mortar": "Moździerz",
  "Helblaster Volley Gun": "Helblaster",
  "Helstorm Rocket Battery": "Wyrzutnia Rakiet Helstorm",
  "Steam Tank": "Czołg Parowy",

  // ===== HIGH ELVES =====
  "Prince": "Książę",
  "Archmage": "Arcymagik",
  "Noble": "Szlachcic",
  "Mage": "Magik",
  "Lothern Sea Guard": "Straż Morska Lothernu",
  "Archers": "Łucznicy",
  "Spearmen {high-elf-realms}": "Włócznicy {high-elf-realms}",
  "Phoenix Guard": "Straż Feniksa",
  "White Lions": "Białe Lwy",
  "Swordmasters": "Mistrzowie Miecza",
  "Dragon Princes": "Książęta Smoków",
  "Silver Helms": "Srebrne Hełmy",
  "Ellyrian Reavers": "Najezdnicy z Ellyrionu",
  "Shadow Warriors": "Wojownicy Cienia",
  "Tiranoc Chariot": "Rydwan Tiranoc",
  "Great Eagle": "Wielki Orzeł",
  "Repeater Bolt Thrower": "Powtarzalna Balisty",
  "Phoenix": "Feniks",

  // ===== DARK ELVES =====
  "Dreadlord": "Pan Grozy",
  "Supreme Sorceress": "Najwyższa Czarodziejka",
  "Master": "Mistrz",
  "Sorceress": "Czarodziejka",
  "Dark Elf Warriors": "Wojownicy Mrocznych Elfów",
  "Darkshards": "Mroczne Ostrza",
  "Bleakswords": "Ponure Miecze",
  "Dreadspears": "Włócznie Grozy",
  "Black Guard": "Czarna Gwardia",
  "Executioners": "Kaci",
  "Witch Elves": "Wiedźmie Elfy",
  "Dark Riders": "Mroczni Jeźdźcy",
  "Cold One Knights": "Rycerze na Zimnych",
  "Cold One Chariot": "Rydwan na Zimnych",
  "Shades": "Cienie",
  "Harpies": "Harpie",
  "Reaper Bolt Thrower": "Balista Żniwiarza",
  "War Hydra": "Wojenna Hydra",
  "Kharibdyss": "Kharibdyss",

  // ===== DWARFS =====
  "Dwarf Lord": "Pan Krasnoludów",
  "Runelord": "Pan Run",
  "Thane": "Than",
  "Runesmith": "Kowal Run",
  "Master Engineer {dwarfen-mountain-holds}": "Mistrz Inżynier {dwarfen-mountain-holds}",
  "Dwarf Warriors": "Wojownicy Krasnoludzcy",
  "Quarrellers": "Kusznicy Krasnoludzcy",
  "Thunderers": "Grzmotówki",
  "Longbeards": "Długie Brody",
  "Ironbreakers": "Łamacze Żelaza",
  "Hammerers": "Młotowcy",
  "Miners": "Górnicy",
  "Slayers": "Pogromcy",
  "Irondrakes": "Żelazne Smoki",
  "Gyrocopter": "Gyrokopter",
  "Gyrobomber": "Gyrobomber",
  "Cannon {dwarfen-mountain-holds}": "Armata {dwarfen-mountain-holds}",
  "Organ Gun": "Armata Organowa",
  "Grudge Thrower": "Ciskacz Urazy",
  "Bolt Thrower {dwarfen-mountain-holds}": "Balista {dwarfen-mountain-holds}",
  "Flame Cannon": "Armata Płomieni",
  "Anvil of Doom": "Kowadło Zagłady",

  // ===== ORCS & GOBLINS =====
  "Orc Warboss": "Wódz Wojenny Orków",
  "Orc Great Shaman": "Wielki Szaman Orków",
  "Orc Big Boss": "Wielki Szef Orków",
  "Orc Shaman": "Szaman Orków",
  "Goblin Warboss": "Wódz Wojenny Goblinów",
  "Goblin Great Shaman": "Wielki Szaman Goblinów",
  "Goblin Big Boss": "Wielki Szef Goblinów",
  "Goblin Shaman": "Szaman Goblinów",
  "Orc Boyz": "Chłopaki Orcy",
  "Orc Arrer Boyz": "Łucznicy Orcy",
  "Goblins": "Gobliny",
  "Night Goblins": "Nocne Gobliny",
  "Snotlings": "Snotlingi",
  "Black Orcs": "Czarne Orki",
  "Orc Boar Boyz": "Dzikowialni Orcy",
  "Savage Orc Boar Boyz": "Dzicy Dzikowialni Orcy",
  "Goblin Wolf Riders": "Wilkojazda Goblinów",
  "Forest Goblin Spider Riders": "Pająkojazda Goblinów Leśnych",
  "Orc Boar Chariot": "Rydwan Dzików Orków",
  "Trolls": "Trolle",
  "Giant {orc-and-goblin-tribes}": "Olbrzym {orc-and-goblin-tribes}",
  "Rock Lobber": "Ciskacz Głazów",
  "Doom Diver Catapult": "Katapulta Nurków Zagłady",
  "Snotling Pump Wagon": "Pompowany Wóz Snotlingów",
  "Arachnarok Spider": "Pająk Arachnarok",

  // ===== VAMPIRE COUNTS =====
  "Vampire Lord": "Władca Wampirów",
  "Necromancer Lord": "Władca Nekromantów",
  "Vampire": "Wampir",
  "Necromancer": "Nekromanta",
  "Wight Lord": "Pan Upiorów",
  "Skeleton Warriors": "Szkieletowi Wojownicy",
  "Zombie Horde": "Horda Zombie",
  "Crypt Ghouls": "Ghule z Krypt",
  "Dire Wolves": "Wilki Zagłady",
  "Corpse Cart": "Wóz Zwłok",
  "Grave Guard": "Straż Grobów",
  "Black Knights": "Czarni Rycerze",
  "Crypt Horrors": "Koszmary z Krypt",
  "Vargheists": "Vargheisty",
  "Blood Knights": "Krwawe Rycerze",
  "Fell Bats": "Nietoperze",
  "Varghulf": "Varghulf",
  "Terrorgheist": "Terrorgheist",
  "Mortis Engine": "Silnik Mortis",

  // ===== TOMB KINGS =====
  "Tomb King": "Król Grobowców",
  "Liche Priest Hierophant": "Hierofant Licza Kapłana",
  "Tomb Prince": "Książę Grobowców",
  "Liche Priest": "Licza Kapłan",
  "Skeleton Warriors {tomb-kings-of-khemri}": "Szkieletowi Wojownicy {tomb-kings-of-khemri}",
  "Skeleton Archers": "Szkieletowi Łucznicy",
  "Tomb Guard": "Straż Grobowców",
  "Ushabti": "Ushabti",
  "Necropolis Knights": "Rycerze Nekropolii",
  "Tomb Scorpion": "Skorpion Grobowców",
  "Sepulchral Stalkers": "Grobowe Tropy",
  "Carrion": "Padlinożercy",
  "Khemrian Warsphinx": "Sfinks Wojenny Khemri",
  "Necrosphinx": "Nekrosfinks",
  "Screaming Skull Catapult": "Katapulta Krzyczących Czaszek",
  "Casket of Souls": "Skrzynia Dusz",

  // ===== BRETONNIA =====
  "Bretonnian Lord": "Pan Bretoński",
  "Prophetess of the Lady": "Prorokini Pani",
  "Paladin": "Palladyn",
  "Damsel of the Lady": "Dama Pani",
  "Men-at-Arms": "Zbrojni",
  "Peasant Bowmen": "Chłopscy Łucznicy",
  "Knights of the Realm": "Rycerze Królestwa",
  "Knights Errant": "Rycerze Wędrowni",
  "Mounted Yeomen": "Konni Jegomościowie",
  "Pegasus Knights": "Rycerze Pegazów",
  "Questing Knights": "Rycerze Poszukujący",
  "Grail Knights": "Rycerze Graala",
  "Grail Reliquae": "Relikwiarz Graala",
  "Field Trebuchet": "Trebusz Polowy",

  // ===== WOOD ELVES =====
  "Elven Prince {wood-elf-realms}": "Elficki Książę {wood-elf-realms}",
  "Spellweaver": "Tkacz Zaklęć",
  "Elven Noble": "Elficki Szlachcic",
  "Spellsinger": "Śpiewak Zaklęć",
  "Glade Guard": "Straż Polany",
  "Eternal Guard": "Wieczna Straż",
  "Dryads": "Driady",
  "Glade Riders": "Jeźdźcy z Polany",
  "Warhawk Riders": "Jeźdźcy Jastrzębi",
  "Wild Riders": "Dzicy Jeźdźcy",
  "Wildwood Rangers": "Tropiciele z Dzikich Lasów",
  "Waywatchers": "Obserwatorzy Ścieżek",
  "Wardancers": "Tancerze Wojowniczy",
  "Treekin": "Drzewce",
  "Treeman": "Drzewiczy",

  // ===== LIZARDMEN =====
  "Slann Mage-Priest": "Magik-Kapłan Slannów",
  "Saurus Oldblood": "Stara Krew Saurusów",
  "Skink Priest": "Kapłan Skinków",
  "Saurus Scar-Veteran": "Weteran Blizn Saurusów",
  "Skink Chief": "Wódz Skinków",
  "Saurus Warriors": "Wojownicy Saurusów",
  "Skink Cohort": "Kohorta Skinków",
  "Skink Skirmishers": "Harownicy Skinków",
  "Temple Guard": "Straż Świątynna",
  "Chameleon Skinks": "Kameleon Skinków",
  "Cold One Cavalry": "Kawaleria na Zimnych",
  "Terradon Riders": "Jeźdźcy Terradonów",
  "Ripperdactyl Riders": "Jeźdźcy Ripperdaktyli",
  "Kroxigors": "Kroxigorzy",
  "Salamander Hunting Pack": "Sfora Łowcza Salamander",
  "Razordon Hunting Pack": "Sfora Łowcza Razordonów",
  "Bastiladon": "Bastiladon",
  "Stegadon": "Stegadon",
  "Ancient Stegadon": "Pradawny Stegadon",
  "Carnosaur": "Karnozaur",

  // ===== SKAVEN =====
  "Grey Seer": "Szary Prorok",
  "Warlord": "Watażka",
  "Warlock Engineer": "Inżynier Czarnoksiężnik",
  "Chieftain": "Wódz Plemienny",
  "Clanrats": "Szczury Klanowe",
  "Stormvermin": "Szturmoszczury",
  "Slaves": "Niewolnicy",
  "Rat Ogres": "Szczurze Ogry",
  "Gutter Runners": "Biegnące Ściekami",
  "Plague Monks": "Mnisi Zarazy",
  "Poisoned Wind Globadiers": "Globadziści Zatrułych Wiatrów",
  "Warpfire Thrower": "Miotacz Osnowy Ognia",
  "Ratling Gun": "Szczurza Kula",
  "Jezzails": "Jezzaile",
  "Plague Censer Bearers": "Niosący Kadzidła Zarazy",
  "Doomwheel": "Koło Zagłady",
  "Hell Pit Abomination": "Obrzydliwość z Piekielnej Jamy",
  "Warp Lightning Cannon": "Armata Błyskawicy Osnowy",
  "Plagueclaw Catapult": "Katapulta Zarazowego Szponu",

  // ===== OGRE KINGDOMS =====
  "Tyrant": "Tyran",
  "Slaughtermaster": "Mistrz Rzezi",
  "Bruiser": "Łobuz",
  "Butcher": "Rzeźnik",
  "Hunter": "Łowca",
  "Ogre Bulls": "Ogry Byki",
  "Ironguts": "Żelazoflaki",
  "Leadbelchers": "Ołowiopoły",
  "Maneaters": "Ludojady",
  "Gnoblars": "Gnoblary",
  "Sabretusks": "Szablozęby",
  "Mournfang Cavalry": "Kawaleria Załobnych Kłów",
  "Ironblaster": "Żelazogrzmot",
  "Stonehorn": "Kamienny Róg",
  "Thundertusk": "Gromogłos",
  "Giant {ogre-kingdoms}": "Olbrzym {ogre-kingdoms}",
  "Scraplauncher": "Ciskacz Złomu",

  // ===== CHAOS DWARFS =====
  "Sorcerer-Prophet": "Czarnoksiężnik-Prorok",
  "Daemonsmith": "Kowal Demonów",
  "Bull Centaur Taur'ruk": "Byczentaur Taur'ruk",
  "Infernal Guard": "Infernalna Straż",
  "Hobgoblin Cutthroats": "Hobgobliny Opryszki",
  "K'daai Fireborn": "K'daai Ognioro",
  "Bull Centaurs": "Byczentaury",
  "Hobgoblin Wolf Raiders": "Hobgobliny Wilkojazda",
  "Iron Daemon": "Żelazny Demon",
  "Magma Cannon": "Armata Magmy",
  "Deathshrieker Rocket Launcher": "Wyrzutnia Rakiet Wrzasku Śmierci",
  "Dreadquake Mortar": "Moździerz Straszliwego Wstrząsu",
  "Hellcannon {chaos-dwarfs}": "Piekielna Armata {chaos-dwarfs}",
  "K'daai Destroyer": "K'daai Niszczyciel",

  // ===== DAEMONS OF CHAOS =====
  "Bloodthirster": "Krwiopijca",
  "Great Unclean One": "Wielki Nieczysta Istota",
  "Lord of Change": "Pan Zmian",
  "Keeper of Secrets": "Strażnik Tajemnic",
  "Daemon Prince {daemons-of-chaos}": "Książę Demonów {daemons-of-chaos}",
  "Herald of Khorne": "Herold Khorne'a",
  "Herald of Nurgle": "Herold Nurgle'a",
  "Herald of Tzeentch": "Herold Tzeentcha",
  "Herald of Slaanesh": "Herold Slaanesha",
  "Bloodletters": "Krwiopuści",
  "Plaguebearers": "Zaraźni",
  "Pink Horrors": "Różowe Koszmary",
  "Daemonettes": "Daemonetki",
  "Bloodcrushers": "Krawomiażdże",
  "Plague Drones": "Zarazowe Truty",
  "Screamers": "Wrzaskuny",
  "Seekers": "Poszukiwacze",
  "Furies": "Furie",
  "Flesh Hounds": "Mięsopsy",
  "Nurglings": "Nurglingi",
  "Flamers": "Płomienie",
  "Fiends": "Demony",
  "Beasts of Nurgle": "Bestie Nurgle'a",
  "Soul Grinder": "Mieliciel Dusz",
  "Skull Cannon": "Armata Czaszek",
  "Burning Chariot": "Płonący Rydwan",
  "Seeker Chariot": "Rydwan Poszukiwaczy",

  // ===== GRAND CATHAY =====
  "Celestial Dragon Shugengan Lord": "Władca Shugengan Niebiańskiego Smoka",
  "Alchemist": "Alchemik",
  "Astromancer": "Astromancer",
  "Dragon-blooded Shugengan Lord": "Władca Shugengan Smoczej Krwi",
  "Cathayan Jade-Warrior Captain": "Kapitan Jadeitowych Wojowników Cathay",
  "Jade Warriors": "Jadeitowi Wojownicy",
  "Peasant Long Spearmen": "Chłopscy Długowłócznicy",
  "Peasant Archers": "Chłopscy Łucznicy",
  "Celestial Dragon Guard": "Straż Niebiańskiego Smoka",
  "Iron Hail Gunners": "Strzelcy Żelaznego Gradu",
  "Jade Warrior Crossbowmen": "Jadeitowi Kusznicy",
  "Terracotta Sentinel": "Terakotowy Wartownik",
  "Crane Gunners": "Strzelcy Żurawi",
  "Wu-Xing War Compass": "Wojenny Kompas Wu-Xing",
  "Grand Cannon {grand-cathay}": "Wielka Armata {grand-cathay}",
  "Fire Rain Rocket Launcher": "Wyrzutnia Rakiet Ognia Deszczu",
  "Sky Lantern": "Latarnia Nieba",
  "Sky-junks": "Niebiańskie Dżonki",
  "Longma Riders": "Jeźdźcy Longma",
  "War Balloons": "Wojenne Balony",
  "Great Longma Riders": "Wielcy Jeźdźcy Longma",
  "Kong Ming Sky Lantern": "Latarnia Nieba Kong Ming",
  "Terracotta Sentinel (Sword)": "Terakotowy Wartownik (Miecz)",

  // Common terms across armies
  "General": "Generał",
  "Battle Standard Bearer": "Nosiciel Sztandaru Bitewnego",
  "Hand weapon": "Broń ręczna",
  "Additional hand weapon": "Dodatkowa broń ręczna",
  "Great weapon": "Wielka broń",
  "Halberd": "Halabarda",
  "Spear": "Włócznia",
  "Lance": "Lanca",
  "Light armour": "Lekka zbroja",
  "Heavy armour": "Ciężka zbroja",
  "Shield": "Tarcza",
  "Barding": "Zbroja dla wierzchowca",
  "Longbow": "Długi łuk",
  "Bow": "Łuk",
  "Crossbow": "Kusza",
  "Handgun": "Rusznica",
  "Pistol": "Pistolet",
  "Repeater crossbow": "Powtarzalna kusza",
  "Warhorse": "Koń bojowy",
  "Barded warhorse": "Zbroja dla konia bojowego",
  "Magic Standard": "Magiczny Sztandar",
  "Magic Items": "Magiczne Przedmioty",
  "Magic Weapon": "Magiczna Broń",
  "Magic Armour": "Magiczna Zbroja",
  "Talisman": "Talizman",
  "Arcane Item": "Przedmiot Tajemny",
  "Enchanted Item": "Zaczarowany Przedmiot",
};

/**
 * Add translations to a single unit file
 */
function addTranslationsToFile(filePath) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing: ${path.basename(filePath)}`);
  console.log('='.repeat(60));

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    let modifiedCount = 0;
    const addedTranslations = [];

    // Process all categories
    for (const category of ['characters', 'core', 'special', 'rare']) {
      if (!data[category]) continue;

      for (const unit of data[category]) {
        const nameEn = unit.name_en;

        // Skip if already has name_pl
        if (unit.name_pl) {
          continue;
        }

        // Check if we have a translation
        if (TRANSLATIONS[nameEn]) {
          // Insert name_pl right after name_en
          const keys = Object.keys(unit);
          const nameEnIndex = keys.indexOf('name_en');

          if (nameEnIndex !== -1) {
            const newUnit = {};
            keys.forEach((key, index) => {
              newUnit[key] = unit[key];
              if (index === nameEnIndex) {
                newUnit.name_pl = TRANSLATIONS[nameEn];
              }
            });

            Object.keys(unit).forEach(key => delete unit[key]);
            Object.keys(newUnit).forEach(key => unit[key] = newUnit[key]);

            modifiedCount++;
            addedTranslations.push({
              category,
              nameEn,
              namePl: TRANSLATIONS[nameEn]
            });
            console.log(`  ✓ [${category.toUpperCase().padEnd(10)}] ${nameEn}`);
            console.log(`    → ${TRANSLATIONS[nameEn]}`);
          }
        }
      }
    }

    if (modifiedCount > 0) {
      // Write back with proper formatting
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`\n✓ Modified ${modifiedCount} units in ${path.basename(filePath)}`);

      // Summary by category
      const byCategory = {};
      addedTranslations.forEach(t => {
        byCategory[t.category] = (byCategory[t.category] || 0) + 1;
      });
      console.log('\nSummary by category:');
      Object.entries(byCategory).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count} units`);
      });
    } else {
      console.log(`\n  No new translations added (may already exist)`);
    }

    return modifiedCount;

  } catch (error) {
    console.error(`\n✗ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

/**
 * Get all army unit files
 */
function getAllArmyFiles() {
  const unitsDir = path.join(__dirname, '..', 'lib', 'data', 'domain', 'units');
  return fs.readdirSync(unitsDir)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(unitsDir, f));
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const unitsDir = path.join(__dirname, '..', 'lib', 'data', 'domain', 'units');

  let filesToProcess = [];

  if (args.length > 0) {
    // Process specific army
    const armyName = args[0];
    const targetFile = path.join(unitsDir, `${armyName}.json`);

    if (!fs.existsSync(targetFile)) {
      console.error(`✗ Error: File not found: ${armyName}.json`);
      console.log('\nAvailable armies:');
      getAllArmyFiles().forEach(f => {
        console.log(`  - ${path.basename(f, '.json')}`);
      });
      process.exit(1);
    }

    filesToProcess = [targetFile];
  } else {
    // Process all armies
    filesToProcess = getAllArmyFiles();
  }

  console.log(`\n${'█'.repeat(60)}`);
  console.log('WARHAMMER ARMY TRANSLATION SCRIPT');
  console.log(`Processing ${filesToProcess.length} army file(s)`);
  console.log(`Total translations available: ${Object.keys(TRANSLATIONS).length}`);
  console.log('█'.repeat(60));

  let totalModified = 0;
  const results = [];

  filesToProcess.forEach(file => {
    const count = addTranslationsToFile(file);
    totalModified += count;
    results.push({
      file: path.basename(file),
      count
    });
  });

  console.log(`\n${'█'.repeat(60)}`);
  console.log('FINAL SUMMARY');
  console.log('█'.repeat(60));
  console.log(`\nTotal units translated: ${totalModified}`);
  console.log(`Files processed: ${filesToProcess.length}`);

  if (results.length > 1) {
    console.log('\nBreakdown by army:');
    results
      .sort((a, b) => b.count - a.count)
      .forEach(r => {
        if (r.count > 0) {
          console.log(`  ${r.file.padEnd(40)} ${r.count.toString().padStart(3)} units`);
        }
      });
  }

  console.log('\n✓ Translation script completed!\n');
}

// Run the script
main();
