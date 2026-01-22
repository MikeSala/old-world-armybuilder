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
  "Exalted Champion": "Wywyższony Czempion",
  "Exalted Sorcerer": "Wywyższony Czarnoksiężnik",
  "Aspiring Champion": "Aspirujący Czempion",
  "Chaos Sorcerer": "Czarnoksiężnik Chaosu",
  "Chaos Warriors": "Wojownicy Chaosu",
  "Chaos Marauders": "Maruderzy Chaosu",
  "Chaos Warhounds": "Bojowe Psy Chaosu",
  "Chaos Warhounds {warriors of chaos}": "Bojowe Psy Chaosu {warriors of chaos}",
  "Marauder Horsemen": "Konni Maruderzy",
  "Chosen Chaos Warriors": "Wybrańcy Chaosu",
  "Chaos Knights": "Rycerze Chaosu",
  "Chaos Trolls": "Trolle Chaosu",
  "Chaos Ogres": "Ogry Chaosu",
  "Gorebeast Chariot": "Rydwan Bestii Krwi",
  "Chosen Chaos Knights": "Wybrańcy Rycerze",
  "Chaos Warshrine": "Świątynia Wojenna Chaosu",
  "Dragon Ogres": "Smocze Ogry",
  "Dragon Ogre Shaggoth": "Shaggoth Smoczy Ogr",
  "Chaos Spawn": "Pomiot Chaosu",
  "Hellcannon": "Piekielna Armata",
  "Forsaken": "Opuszczeni",
  "Chaos Chariot": "Rydwan Chaosu",
  "Chimera": "Chimera",
  "Chaos Giant": "Olbrzym Chaosu",

  // ===== BEASTMEN BRAYHERDS =====
  "Beastlord": "Pan Bestii",
  "Great Bray-Shaman": "Wielki Braillechaman",
  "Wargor": "Wargor",
  "Bray-Shaman": "Braillechaman",
  "Gorebull": "Gorebull",
  "Doombull": "Doombull",
  "Warhoof": "Wojenkopiyt",
  "Kralmaw": "Kralmaw",
  "Ghorros": "Ghorros",
  "Gor Herd": "Stado Gorów",
  "Gors": "Gory",
  "Ungor Herd": "Stado Ungorów",
  "Ungors": "Ungory",
  "Ungor Raiders": "Najeźdźcy Ungorzy",
  "Chaos Warhounds {beastmen-brayherds}": "Bojowe Psy Chaosu {beastmen-brayherds}",
  "Primal Warhounds": "Pierwotne Psy Wojenne",
  "Primal Warherd": "Pierwotne Stado Wojenne",
  "Bestigor Herd": "Stado Bestigorów",
  "Minotaurs": "Minotaury",
  "Minotaur Herd": "Stado Minotaurów",
  "Centigors": "Centigorzy",
  "Centigor Herd": "Stado Centigorów",
  "Razorgor Herd": "Stado Brzytwogrów",
  "Razorgor Chariot": "Rydwan Brzytwogrów",
  "Tuskgor Chariot": "Rydwan Tuskgora",
  "Chaos Spawn {beastmen-brayherds}": "Pomiot Chaosu {beastmen-brayherds}",
  "Giant": "Olbrzym",
  "Ghorgon": "Ghorgon",
  "Cygor": "Cygor",
  "Cockatrice": "Kokatrys",
  "Jabberslythe": "Jabberslythe",
  "Herdstone": "Kamień Stada",
  "Preyton": "Preyton",
  "Warped Gors": "Wypaczone Gory",

  // ===== EMPIRE OF MAN =====
  "General of the Empire": "Generał Imperium",
  "Grand Master": "Wielki Mistrz",
  "Chapter Master": "Mistrz Kapituły",
  "Battle Wizard Lord": "Władca Czarodziejów Bitewnych",
  "Wizard Lord": "Władca Czarodziejów",
  "Master Mage": "Mistrz Magii",
  "Witch Hunter": "Łowca Czarownic",
  "Lector of Sigmar": "Lektor Sigmara",
  "Priest of Sigmar": "Kapłan Sigmara",
  "High Priest of Ulric": "Wysoki Kapłan Ulryka",
  "Priest of Ulric": "Kapłan Ulryka",
  "Empire Engineer": "Inżynier Imperium",
  "Harbinger of Doom": "Zwiastun Zagłady",
  "General Hans von Löwenhacke": "Generał Hans von Löwenhacke",
  "Harald Gemunsen": "Harald Gemunsen",
  "Captain of the Empire": "Kapitan Imperium",
  "Battle Wizard": "Czarodziej Bitewny",
  "Warrior Priest": "Kapłan Wojownik",
  "Master Engineer": "Mistrz Inżynier",
  "Halberdiers": "Halabardnicy",
  "Swordsmen": "Mieczownicy",
  "Spearmen": "Włócznicy",
  "State Troops": "Wojska Stanowe",
  "Nuln State Troops": "Wojska Stanowe Nulnu",
  "Veteran State Troops": "Weterani Wojsk Stanowych",
  "Nuln Veteran State Troops": "Weterani Wojsk Stanowych Nulnu",
  "State Missile Troops": "Wojska Strzeleckie Stanowe",
  "Free Company": "Wolna Kompania",
  "Free Company Militia": "Milicja Wolnej Kompanii",
  "Empire Archers": "Łucznicy Imperium",
  "Handgunners": "Arkebuzjerzy",
  "Crossbowmen": "Kusznicy",
  "Huntsmen": "Łowcy",
  "Flagellants": "Flagelanci",
  "Greatswords": "Mieczownicy Olbrzymów",
  "Empire Greatswords": "Wielcy Mieczownicy Imperium",
  "Teutogen Guard": "Gwardia Teutogenów",
  "Knights of the Empire": "Rycerze Imperium",
  "Empire Knights": "Rycerze Imperium",
  "Empire Knights Panther": "Rycerze Pantery Imperium",
  "Empire Knights of the White Wolf": "Rycerze Białego Wilka Imperium",
  "Empire Knights of the Blazing Sun": "Rycerze Płonącego Słońca Imperium",
  "Empire Knights of Morr": "Rycerze Morra Imperium",
  "Empire Knights of the Fiery Heart": "Rycerze Ognistego Serca Imperium",
  "Inner Circle Knights": "Rycerze Wewnętrznego Kręgu",
  "Inner Circle Knights Panther": "Rycerze Pantery Wewnętrznego Kręgu",
  "Inner Circle Knights of the White Wolf": "Rycerze Białego Wilka Wewnętrznego Kręgu",
  "Inner Circle Knights of the Blazing Sun": "Rycerze Płonącego Słońca Wewnętrznego Kręgu",
  "Inner Circle Knights of Morr": "Rycerze Morra Wewnętrznego Kręgu",
  "Inner Circle Knights of the Fiery Heart": "Rycerze Ognistego Serca Wewnętrznego Kręgu",
  "Pistoliers": "Pistoletnicy",
  "Outriders": "Zwiadowcy",
  "Demigryph Knights": "Rycerze na Demigryfach",
  "Demigryph Knights Panther": "Rycerze Pantery na Demigryfach",
  "Demigryph Knights of the White Wolf": "Rycerze Białego Wilka na Demigryfach",
  "Demigryph Knights of the Blazing Sun": "Rycerze Płonącego Słońca na Demigryfach",
  "Demigryph Knights of Morr": "Rycerze Morra na Demigryfach",
  "Demigryph Knights of the Fiery Heart": "Rycerze Ognistego Serca na Demigryfach",
  "Great Cannon": "Wielka Armata",
  "Great Cannon {empire}": "Wielka Armata {empire}",
  "Mortar": "Moździerz",
  "Mortar {empire}": "Moździerz {empire}",
  "Empire War Wagon": "Wóz Wojenny Imperium",
  "Empire Road Wardens": "Strażnicy Dróg Imperium",
  "Helblaster Volley Gun": "Helblaster",
  "Helstorm Rocket Battery": "Wyrzutnia Rakiet Helstorm",
  "Steam Tank": "Czołg Parowy",

  // ===== HIGH ELVES =====
  "Prince": "Książę",
  "Archmage": "Arcymagik",
  "Noble": "Szlachcic",
  "Mage": "Magik",
  "Dragon Mage": "Smoczy Mag",
  "Handmaiden of the Everqueen": "Służebna Wiecznie Królowej",
  "Chracian Chieftain": "Wódz z Chracii",
  "Sea Guard Garrison Commander": "Dowódca Garnizonu Straży Morskiej",
  "Storm Weaver": "Tkaczka Burzy",
  "Korhil Lionmane": "Korhil Lwia Grzywa",
  "Ishaya Vess": "Ishaya Vess",
  "Lothern Sea Guard": "Straż Morska Lothernu",
  "Archers": "Łucznicy",
  "Elven Archers": "Elficcy Łucznicy",
  "Elven Spearmen": "Elficcy Włócznicy",
  "Spearmen {high-elf-realms}": "Włócznicy {high-elf-realms}",
  "Sisters of Avelorn": "Siostry z Avelorn",
  "Chracian Woodsmen": "Leśnicy z Chracii",
  "White Lions of Chrace": "Białe Lwy z Chracii",
  "Ship's Company": "Załoga Okrętowa",
  "Phoenix Guard": "Straż Feniksa",
  "White Lions": "Białe Lwy",
  "Swordmasters": "Mistrzowie Miecza",
  "Swordmasters of Hoeth": "Mistrzowie Miecza z Hoeth",
  "Dragon Princes": "Książęta Smoków",
  "Silver Helms": "Srebrne Hełmy",
  "Ellyrian Reavers": "Najezdnicy z Ellyrionu",
  "Shadow Warriors": "Wojownicy Cienia",
  "Tiranoc Chariot": "Rydwan Tiranoc",
  "Tiranoc Chariots": "Rydwany Tiranoc",
  "Lion Chariot of Chrace": "Rydwan Lwów z Chracii",
  "Lothern Skycutter": "Przecinak Nieba z Lothernu",
  "War Lions": "Wojenne Lwy",
  "Lion Guard": "Gwardia Lwów",
  "Great Eagle": "Wielki Orzeł",
  "Repeater Bolt Thrower": "Powtarzalna Balista",
  "Eagle-Claw Bolt Thrower": "Balista Orlich Pazurów",
  "Phoenix": "Feniks",
  "Flamespyre Phoenix": "Feniks Płomiennej Pyry",
  "Frostheart Phoenix": "Feniks Mroźnego Serca",
  "Merwyrm": "Morski Smok",

  // ===== DARK ELVES =====
  "Dreadlord": "Pan Grozy",
  "Dark Elf Dreadlord": "Pan Grozy Mrocznych Elfów",
  "Supreme Sorceress": "Najwyższa Czarodziejka",
  "Master": "Mistrz",
  "Dark Elf Master": "Mistrz Mrocznych Elfów",
  "High Beastmaster": "Wysoki Mistrz Bestii",
  "Death Hag": "Wiedźma Śmierci",
  "Khainite Assassin": "Skrytobójca Khaine'a",
  "Sorceress": "Czarodziejka",
  "Dark Elf Warriors": "Wojownicy Mrocznych Elfów",
  "Darkshards": "Mroczne Ostrza",
  "Bleakswords": "Ponure Miecze",
  "Dreadspears": "Włócznie Grozy",
  "Repeater Crossbowmen": "Kusznicy z Powtarzalną Kuszą",
  "Black Ark Corsairs": "Korsarze Czarnej Arki",
  "Black Guard": "Czarna Gwardia",
  "Black Guard of Naggarond": "Czarna Gwardia Naggarondu",
  "Executioners": "Kaci",
  "Har Ganeth Executioners": "Kaci z Har Ganeth",
  "Witch Elves": "Wiedźmie Elfy",
  "Dark Riders": "Mroczni Jeźdźcy",
  "Cold One Knights": "Rycerze na Zimnych",
  "Cold One Chariot": "Rydwan na Zimnych",
  "Shades": "Cienie",
  "Dark Elf Shades": "Cienie Mrocznych Elfów",
  "Harpies": "Harpie",
  "Reaper Bolt Thrower": "Balista Żniwiarza",
  "War Hydra": "Wojenna Hydra",
  "Kharibdyss": "Kharibdyss",
  "Scourgerunner Chariots": "Rydwany Biczowników",
  "Sisters of Slaughter": "Siostry Rzezi",
  "Bloodwrack Shrines": "Sanktuaria Krwawej Agonii",
  "Bloodwrack Medusas": "Meduzy Krwawej Agonii",
  "Doomfire Warlocks": "Czarnoksiężnicy Ognia Zagłady",

  // ===== DWARFS =====
  "Dwarf Lord": "Pan Krasnoludów",
  "King": "Król",
  "Runelord": "Pan Run",
  "Thane": "Than",
  "Runesmith": "Kowal Run",
  "Daemon Slayer": "Pogromca Demonów",
  "Dragon Slayer": "Pogromca Smoków",
  "Engineer": "Inżynier",
  "Engineer Sapper": "Inżynier Saper",
  "Thorgrim Ulleksson": "Thorgrim Ulleksson",
  "Ungrim Ironfist": "Ungrim Żelazna Pięść",
  "Burlok Damminson": "Burlok Damminson",
  "Master Engineer {dwarfen-mountain-holds}": "Mistrz Inżynier {dwarfen-mountain-holds}",
  "Dwarf Warriors": "Wojownicy Krasnoludzcy",
  "Royal Clan Warriors": "Wojownicy Królewskiego Klanu",
  "Quarrellers": "Kusznicy Krasnoludzcy",
  "Thunderers": "Grzmotówki",
  "Longbeards": "Długie Brody",
  "Rangers": "Tropiciele",
  "Scout Gyrocopters": "Gyrokoptery Zwiadowcze",
  "Dwarf Cart": "Wóz Krasnoludzki",
  "Ironbreakers": "Łamacze Żelaza",
  "Hammerers": "Młotowcy",
  "Miners": "Górnicy",
  "Slayers": "Pogromcy",
  "Brotherhood of Grimnir": "Bractwo Grimnira",
  "Doomseeker": "Szukający Zagłady",
  "Irondrakes": "Żelazne Smoki",
  "Gyrocopter": "Gyrokopter",
  "Gyrocopters": "Gyrokoptery",
  "Gyrobomber": "Gyrobomber",
  "Cannon {dwarfen-mountain-holds}": "Armata {dwarfen-mountain-holds}",
  "Organ Gun": "Armata Organowa",
  "Grudge Thrower": "Ciskacz Urazy",
  "Bolt Thrower {dwarfen-mountain-holds}": "Balista {dwarfen-mountain-holds}",
  "Flame Cannon": "Armata Płomieni",
  "Goblin-Hewer": "Rozpruwacz Goblinów",
  "Bolt Thrower {dwarfs}": "Balista {dwarfs}",
  "Cannon {dwarfs}": "Armata {dwarfs}",
  "Anvil of Doom": "Kowadło Zagłady",

  // ===== ORCS & GOBLINS =====
  "Orc Warboss": "Wódz Wojenny Orków",
  "Black Orc Warboss": "Wódz Wojenny Czarnych Orków",
  "Orc Great Shaman": "Wielki Szaman Orków",
  "Orc Big Boss": "Wielki Szef Orków",
  "Orc Bigboss": "Wielki Szef Orków",
  "Black Orc Bigboss": "Wielki Szef Czarnych Orków",
  "Orc Shaman": "Szaman Orków",
  "Orc Weirdnob": "Dziwobok Orków",
  "Orc Weirdboy": "Dziwochłop Orków",
  "Goblin Warboss": "Wódz Wojenny Goblinów",
  "Goblin Great Shaman": "Wielki Szaman Goblinów",
  "Goblin Big Boss": "Wielki Szef Goblinów",
  "Goblin Bigboss": "Wielki Szef Goblinów",
  "Goblin Shaman": "Szaman Goblinów",
  "Goblin Oddnob": "Dziwniak Goblinów",
  "Goblin Oddgit": "Dziwak Goblinów",
  "Night Goblin Warboss": "Wódz Wojenny Nocnych Goblinów",
  "Night Goblin Bigboss": "Wielki Szef Nocnych Goblinów",
  "Night Goblin Oddnob": "Dziwniak Nocnych Goblinów",
  "Night Goblin Oddgit": "Dziwak Nocnych Goblinów",
  "Orc Boyz": "Chłopaki Orcy",
  "Orc Mob": "Tłum Orków",
  "Black Orc Mob": "Tłum Czarnych Orków",
  "Orc Arrer Boyz": "Łucznicy Orcy",
  "Goblins": "Gobliny",
  "Goblin Mob": "Tłum Goblinów",
  "Night Goblins": "Nocne Gobliny",
  "Night Goblin Mob": "Tłum Nocnych Goblinów",
  "Snotlings": "Snotlingi",
  "Snotling Mob": "Tłum Snotlingów",
  "Fanatics": "Fanatycy",
  "Black Orcs": "Czarne Orki",
  "Orc Boar Boyz": "Dzikowialni Orcy",
  "Orc Boar Boy Mob": "Tłum Dzikowych Orców",
  "Savage Orc Boar Boyz": "Dzicy Dzikowialni Orcy",
  "Goblin Wolf Riders": "Wilkojazda Goblinów",
  "Goblin Wolf Rider Mob": "Tłum Wilkojazdy Goblinów",
  "Goblin Spider Rider Mob": "Tłum Pająkojazdy Goblinów",
  "Forest Goblin Spider Riders": "Pająkojazda Goblinów Leśnych",
  "Night Goblin Squig Herd": "Stado Squigów Nocnych Goblinów",
  "Night Goblin Squig Hopper Mob": "Tłum Skakaczów na Squigach Nocnych Goblinów",
  "Orc Boar Chariot": "Rydwan Dzików Orków",
  "Goblin Wolf Chariots": "Rydwany Wilków Goblinów",
  "Trolls": "Trolle",
  "Common Troll Mob": "Tłum Zwykłych Trolli",
  "River Troll Mob": "Tłum Rzecznych Trolli",
  "Stone Troll Mob": "Tłum Kamiennych Trolli",
  "Giant {orc-and-goblin-tribes}": "Olbrzym {orc-and-goblin-tribes}",
  "Rock Lobber": "Ciskacz Głazów",
  "Goblin Rock Lobber": "Gobliński Ciskacz Głazów",
  "Doom Diver Catapult": "Katapulta Nurków Zagłady",
  "Snotling Pump Wagon": "Pompowany Wóz Snotlingów",
  "Snotling Pump Wagons": "Pompowane Wozy Snotlingów",
  "Goblin Bolt Throwa": "Balista Goblinów",
  "Mangler Squigs": "Squigi Miażdżyciele",
  "Arachnarok Spider": "Pająk Arachnarok",

  // ===== VAMPIRE COUNTS =====
  "Vampire Lord": "Władca Wampirów",
  "Vampire Count {renegade}": "Hrabia Wampir {renegade}",
  "Vampire Thrall": "Sługa Wampir",
  "Master Necromancer": "Mistrz Nekromanta",
  "Necromantic Acolyte": "Nekromantyczny Akolita",
  "Strigoi Ghoul King": "Król Ghuli Strigoi",
  "Cairn Wraith": "Widmo z Kurhanu",
  "Tomb Banshee": "Grobowa Banshee",
  "Necromancer Lord": "Władca Nekromantów",
  "Vampire": "Wampir",
  "Necromancer": "Nekromanta",
  "Wight Lord": "Pan Upiorów",
  "Wight King": "Król Upiorów",
  "Skeleton Warriors": "Szkieletowi Wojownicy",
  "Skeleton Warriors {vampire counts}": "Szkieletowi Wojownicy {vampire counts}",
  "Zombies": "Zombie",
  "Zombie Horde": "Horda Zombie",
  "Crypt Ghouls": "Ghule z Krypt",
  "Dire Wolves": "Wilki Zagłady",
  "Bat Swarms": "Roje Nietoperzy",
  "Corpse Cart": "Wóz Zwłok",
  "Grave Guard": "Straż Grobów",
  "Black Knights": "Czarni Rycerze",
  "Spirit Hosts": "Zastępy Duchów",
  "Crypt Horrors": "Koszmary z Krypt",
  "Vargheists": "Vargheisty",
  "Blood Knights": "Krwawe Rycerze",
  "Fell Bats": "Nietoperze",
  "Varghulf": "Varghulf",
  "Terrorgheist": "Terrorgheist",
  "Mortis Engine": "Silnik Mortis",
  "Black Coach": "Czarny Powóz",
  "Hexwraiths": "Wiedźmogonów",

  // ===== TOMB KINGS =====
  "Tomb King": "Król Grobowców",
  "Liche Priest Hierophant": "Hierofant Licza Kapłana",
  "Tomb Prince": "Książę Grobowców",
  "Royal Herald": "Królewski Herold",
  "High Priest": "Wysoki Kapłan",
  "Mortuary Priest": "Kapłan Grobowy",
  "Arch Necrotect": "Arcynekrotekt",
  "Necrotect": "Nekrotekt",
  "Settra the Imperishable": "Settra Niezniszczalny",
  "Prince Apophas": "Książę Apophas",
  "Nekaph": "Nekaph",
  "Liche Priest": "Licza Kapłan",
  "Skeleton Warriors {tomb-kings-of-khemri}": "Szkieletowi Wojownicy {tomb-kings-of-khemri}",
  "Skeleton Warriors {tomb kings}": "Szkieletowi Wojownicy {tomb kings}",
  "Skeleton Skirmishers": "Szkieletowi Harownicy",
  "Skeleton Infantry Cohort": "Kohorta Szkieletowej Piechoty",
  "Skeleton Chariots": "Szkieletowe Rydwany",
  "Skeleton Horsemen": "Szkieletowi Konni",
  "Skeleton Horse Archers": "Szkieletowi Konni Łucznicy",
  "Skeleton Cavalry Cohort": "Kohorta Szkieletowej Kawalerii",
  "Tomb Swarms": "Roje Grobowców",
  "Necroserpents": "Nekrowęże",
  "Skeleton Archers": "Szkieletowi Łucznicy",
  "Tomb Guard": "Straż Grobowców",
  "Tomb Guard Chariots": "Rydwany Straży Grobowców",
  "Ushabti": "Ushabti",
  "Venerable Ushabti": "Czcigodni Ushabti",
  "Necropolis Knights": "Rycerze Nekropolii",
  "Tomb Scorpion": "Skorpion Grobowców",
  "Sepulchral Stalkers": "Grobowe Tropy",
  "Carrion": "Padlinożercy",
  "Khemrian Warsphinx": "Sfinks Wojenny Khemri",
  "Necrosphinx": "Nekrosfinks",
  "Necrolith Colossus": "Kolos Nekrolitowy",
  "Screaming Skull Catapult": "Katapulta Krzyczących Czaszek",
  "Casket of Souls": "Skrzynia Dusz",

  // ===== BRETONNIA =====
  "Bretonnian Lord": "Pan Bretoński",
  "Duke": "Książę",
  "Baron": "Baron",
  "Prophetess of the Lady": "Prorokini Pani",
  "Prophetess": "Prorokini",
  "Damsel": "Dama",
  "Sergeant-at-Arms": "Sierżant Zbrojny",
  "Outcast Wizard": "Czarodziej Wyrzutek",
  "The Green Knight": "Zielony Rycerz",
  "Sir Cecil Gastonne": "Sir Cecil Gastonne",
  "Lady Élisse Duchaard": "Dama Élisse Duchaard",
  "Paladin": "Palladyn",
  "Damsel of the Lady": "Dama Pani",
  "Men-at-Arms": "Zbrojni",
  "Peasant Bowmen": "Chłopscy Łucznicy",
  "Knights of the Realm": "Rycerze Królestwa",
  "Knights of the Realm on Foot": "Rycerze Królestwa Pieszo",
  "Mounted Knights of the Realm": "Konni Rycerze Królestwa",
  "Knights Errant": "Rycerze Wędrowni",
  "Yeomen Guard": "Straż Jegomościów",
  "Mounted Yeomen": "Konni Jegomościowie",
  "Battle Pilgrims": "Pielgrzymi Bitewni",
  "Squires": "Giermkowie",
  "Pegasus Knights": "Rycerze Pegazów",
  "Questing Knights": "Rycerze Poszukujący",
  "Grail Knights": "Rycerze Graala",
  "Grail Reliquae": "Relikwiarz Graala",
  "Border Princes Brigands": "Bandyci Książąt Pogranicza",
  "Border Princes Bombard": "Bombarda Książąt Pogranicza",
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
  "Slann Mage-Priest {renegade}": "Magik-Kapłan Slannów {renegade}",
  "Saurus Oldblood": "Stara Krew Saurusów",
  "Skink Priest": "Kapłan Skinków",
  "Saurus Scar-Veteran": "Weteran Blizn Saurusów",
  "Skink Chief": "Wódz Skinków",
  "Saurus Warriors": "Wojownicy Saurusów",
  "Skink Cohort": "Kohorta Skinków",
  "Skink Skirmishers": "Harownicy Skinków",
  "Jungle Swarms": "Roje Dżungli",
  "Temple Guard": "Straż Świątynna",
  "Temple Guard {renegade}": "Straż Świątynna {renegade}",
  "Chameleon Skinks": "Kameleon Skinków",
  "Cold One Cavalry": "Kawaleria na Zimnych",
  "Cold One Riders": "Jeźdźcy na Zimnych",
  "Terradon Riders": "Jeźdźcy Terradonów",
  "Ripperdactyl Riders": "Jeźdźcy Ripperdaktyli",
  "Kroxigors": "Kroxigorzy",
  "Salamander Hunting Pack": "Sfora Łowcza Salamander",
  "Salamander Pack": "Sfora Salamander",
  "Razordon Hunting Pack": "Sfora Łowcza Razordonów",
  "Razordon Pack": "Sfora Razordonów",
  "Bastiladon": "Bastiladon",
  "Stegadon": "Stegadon",
  "Ancient Stegadon": "Pradawny Stegadon",
  "Troglodon": "Troglodon",
  "Carnosaur": "Karnozaur",

  // ===== SKAVEN =====
  "Grey Seer": "Szary Prorok",
  "Warlord": "Watażka",
  "Skaven Warlord": "Watażka Skavenów",
  "Warlock Engineer": "Inżynier Czarnoksiężnik",
  "Master Assassin": "Mistrz Skrytobójca",
  "Plague Priest": "Kapłan Zarazy",
  "Chieftain": "Wódz Plemienny",
  "Skaven Chieftain": "Wódz Plemienny Skavenów",
  "Clanrats": "Szczury Klanowe",
  "Stormvermin": "Szturmoszczury",
  "Slaves": "Niewolnicy",
  "Weapon Team": "Zespół Broni",
  "Rat Swarms": "Roje Szczurów",
  "Giant Rats": "Olbrzymie Szczury",
  "Night Runners": "Nocni Biegacze",
  "Rat Ogres": "Szczurze Ogry",
  "Gutter Runners": "Biegnące Ściekami",
  "Plague Monks": "Mnisi Zarazy",
  "Poisoned Wind Globadiers": "Globadziści Zatrułych Wiatrów",
  "Warpfire Thrower": "Miotacz Osnowy Ognia",
  "Ratling Gun": "Szczurza Kula",
  "Jezzails": "Jezzaile",
  "Warplock Jezzails": "Jezzaile Osnowego Zamka",
  "Plague Censer Bearers": "Niosący Kadzidła Zarazy",
  "Doomwheel": "Koło Zagłady",
  "Hell Pit Abomination": "Obrzydliwość z Piekielnej Jamy",
  "Hell Pit Abomination {renegade}": "Obrzydliwość z Piekielnej Jamy {renegade}",
  "Warp Lightning Cannon": "Armata Błyskawicy Osnowy",
  "Plagueclaw Catapult": "Katapulta Zarazowego Szponu",

  // ===== OGRE KINGDOMS =====
  "Tyrant": "Tyran",
  "Slaughtermaster": "Mistrz Rzezi",
  "Bruiser": "Łobuz",
  "Butcher": "Rzeźnik",
  "Firebelly": "Ogniobrzuch",
  "Hunter": "Łowca",
  "Ogre Bulls": "Ogry Byki",
  "Ironguts": "Żelazoflaki",
  "Leadbelchers": "Ołowiopoły",
  "Maneaters": "Ludojady",
  "Gnoblars": "Gnoblary",
  "Gnoblar Fighters": "Gnoblarscy Wojownicy",
  "Gnoblar Trappers": "Gnoblarscy Traperzy",
  "Sabretusks": "Szablozęby",
  "Sabretusk Pack": "Sfora Szablozębów",
  "Yhetees": "Yhetee",
  "Gnoblar Scraplauncher": "Gnoblarskie Ciskacze Złomu",
  "Mournfang Cavalry": "Kawaleria Załobnych Kłów",
  "Ironblaster": "Żelazogrzmot",
  "Stonehorn": "Kamienny Róg",
  "Stonehorn Riders": "Jeźdźcy Kamiennego Rogu",
  "Thundertusk": "Gromogłos",
  "Thundertusk Riders": "Jeźdźcy Gromogłosa",
  "Gorger": "Żarłok",
  "Giant {ogre-kingdoms}": "Olbrzym {ogre-kingdoms}",
  "Scraplauncher": "Ciskacz Złomu",

  // ===== CHAOS DWARFS =====
  "Sorcerer-Prophet": "Czarnoksiężnik-Prorok",
  "Daemonsmith": "Kowal Demonów",
  "Daemonsmith Sorcerer": "Czarnoksiężnik Kowal Demonów",
  "Infernal Castellan": "Infernalny Kasztelan",
  "Infernal Seneschal": "Infernalny Seneszal",
  "Hobgoblin Khan": "Hobgobliński Chan",
  "Black Orc Warboss": "Wódz Wojenny Czarnych Orków",
  "Black Orc Bigboss": "Wielki Szef Czarnych Orków",
  "Bull Centaur Taur'ruk": "Byczentaur Taur'ruk",
  "Infernal Guard": "Infernalna Straż",
  "Infernal Ironsworn": "Infernalni Żelazo-Przysięgli",
  "Black Orc Mob": "Tłum Czarnych Orków",
  "Hobgoblin Cutthroats": "Hobgobliny Opryszki",
  "Sneaky Gits": "Podstępne Dranie",
  "K'daai Fireborn": "K'daai Ognioro",
  "K'daai Fireborn {renegade}": "K'daai Ognioro {renegade}",
  "Bull Centaurs": "Byczentaury",
  "Bull Centaur Renders": "Byczentaury Rozdzieracze",
  "Hobgoblin Wolf Raiders": "Hobgobliny Wilkojazda",
  "Hobgoblin Wolf Riders": "Hobgoblińska Wilkojazda",
  "Hobgoblin Bolt Thrower": "Hobgoblińska Balista",
  "Iron Daemon": "Żelazny Demon",
  "Magma Cannon": "Armata Magmy",
  "Deathshrieker Rocket Launcher": "Wyrzutnia Rakiet Wrzasku Śmierci",
  "Dreadquake Mortar": "Moździerz Straszliwego Wstrząsu",
  "Hellcannon {chaos-dwarfs}": "Piekielna Armata {chaos-dwarfs}",
  "K'daai Destroyer": "K'daai Niszczyciel",
  "Chaos Giant": "Olbrzym Chaosu",

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
  "Miao Ying": "Miao Ying",
  "Shugengan Lord": "Władca Shugengan",
  "Shugengan General": "Generał Shugengan",
  "Lord Magistrate": "Lord Magistrat",
  "Strategist": "Strateg",
  "Gate Master": "Mistrz Bramy",
  "Gate Keeper": "Strażnik Bramy",
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
  "Cathayan Sentinel": "Wartownik Cathay",
  "Jade Lancers": "Jadeitowi Lansjerzy",
  "Crane Gunners": "Strzelcy Żurawi",
  "Wu-Xing War Compass": "Wojenny Kompas Wu-Xing",
  "Grand Cannon {grand-cathay}": "Wielka Armata {grand-cathay}",
  "Cathayan Grand Cannon": "Wielka Armata Cathay",
  "Fire Rain Rocket Launcher": "Wyrzutnia Rakiet Ognia Deszczu",
  "Fire Rain Rocket Battery": "Bateria Rakiet Ognia Deszczu",
  "Sky Lantern": "Latarnia Nieba",
  "Sky-junks": "Niebiańskie Dżonki",
  "Longma Riders": "Jeźdźcy Longma",
  "War Balloons": "Wojenne Balony",
  "Great Longma Riders": "Wielcy Jeźdźcy Longma",
  "Kong Ming Sky Lantern": "Latarnia Nieba Kong Ming",
  "Terracotta Sentinel (Sword)": "Terakotowy Wartownik (Miecz)",

  // ===== WOOD ELF REALMS (Additional units) =====
  "Deepwood Hound": "Pies z Głębokiego Lasu",
  "Forest Cat": "Leśny Kot",
  "Sylvan Boar": "Leśny Dzik",
  "Bear of Loren": "Niedźwiedź Lorenu",

  // ===== RENEGADE CROWNS =====
  "Renegade Prince": "Książę Renegat",
  "Renegade Captain": "Kapitan Renegat",
  "Outcast Wizard": "Czarodziej Wyrzutek",
  "Sellsword Infantry": "Najemna Piechota",
  "Veteran Sellswords": "Weterani Najemni",
  "Freeblade Knights": "Rycerze Wolnego Ostrza",
  "Hireling Outriders": "Najemni Zwiadowcy",
  "Free Company Militia": "Milicja Wolnej Kompanii",
  "Empire Archers": "Łucznicy Imperium",
  "Veteran Freeblades": "Weterani Wolnego Ostrza",
  "Border Princes Mortar": "Moździerz Książąt Pogranicza",
  "Border Princes Brigands": "Bandyci Książąt Pogranicza",
  "Border Princes Organ Gun": "Armata Organowa Książąt Pogranicza",
  "Border Princes Bombard": "Bombarda Książąt Pogranicza",

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
