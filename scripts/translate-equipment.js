#!/usr/bin/env node

/**
 * Script to add name_pl translations to equipment items in army unit JSON files
 * Usage: node scripts/translate-equipment.js [army-name]
 *
 * Examples:
 *   node scripts/translate-equipment.js                    # Process all armies
 *   node scripts/translate-equipment.js empire-of-man      # Process single army
 */

const fs = require('fs');
const path = require('path');

// Equipment translation database
const EQUIPMENT_TRANSLATIONS = {
  // === COMMON EQUIPMENT ===
  "Hand weapon": "Broń ręczna",
  "Hand weapons": "Broń ręczna",
  "Additional hand weapon": "Dodatkowa broń ręczna",
  "Additional hand weapons": "Dodatkowa broń ręczna",
  "Great weapon": "Wielka broń",
  "Great weapons": "Wielka broń",
  "Halberd": "Halabarda",
  "Spear": "Włócznia",
  "Cavalry spear": "Włócznia kawalerii",
  "Lance": "Lanca",
  "Throwing axe": "Topór do rzucania",
  "Throwing axes": "Topory do rzucania",
  "Javelin": "Oszczep",
  "Javelins": "Oszczepy",

  // === ARMOUR ===
  "Light armour": "Lekka zbroja",
  "Heavy armour": "Ciężka zbroja",
  "Plate armour": "Zbroja płytowa",
  "Full plate armour": "Pełna zbroja płytowa",
  "Shield": "Tarcza",
  "Shields": "Tarcze",
  "Chaos Armour": "Zbroja Chaosu",
  "Barding": "Zbroja dla wierzchowca",

  // === RANGED WEAPONS ===
  "Bow": "Łuk",
  "Longbow": "Długi łuk",
  "Shortbow": "Krótki łuk",
  "Crossbow": "Kusza",
  "Repeater crossbow": "Powtarzalna kusza",
  "Handgun": "Arkebuz",
  "Pistol": "Pistolet",
  "Brace of pistols": "Para pistolety",

  // === COMMAND ===
  "General": "Generał",
  "Battle Standard Bearer": "Nosiciel Sztandaru Bitewnego",
  "Standard bearer": "Sztandarowy",
  "Musician": "Muzyk",
  "Champion": "Czempion",

  // === MOUNTS ===
  "On foot": "Pieszo",
  "Warhorse": "Rumak bojowy",
  "Barded warhorse": "Opancerzony rumak bojowy",
  "Elven steed": "Elficki rumak",
  "Cold One": "Zimny",
  "Pegasus": "Pegaz",
  "Great Eagle": "Wielki Orzeł",
  "Griffon": "Gryf",
  "Dragon": "Smok",
  "Manticore": "Mantikora",
  "Chariot": "Rydwan",
  "War Altar": "Ołtarz Wojenny",

  // === MAGIC ===
  "Wizard": "Czarodziej",
  "Level 1 Wizard": "Czarodziej poziomu 1",
  "Level 2 Wizard": "Czarodziej poziomu 2",
  "Level 3 Wizard": "Czarodziej poziomu 3",
  "Level 4 Wizard": "Czarodziej poziomu 4",
  "Lore of Fire": "Wiedza Ognia",
  "Lore of Metal": "Wiedza Metalu",
  "Lore of Shadow": "Wiedza Cieni",
  "Lore of Beasts": "Wiedza Bestii",
  "Lore of Light": "Wiedza Światła",
  "Lore of Life": "Wiedza Życia",
  "Lore of Death": "Wiedza Śmierci",
  "Lore of Heavens": "Wiedza Niebios",

  // === CHAOS MARKS ===
  "Mark of Chaos Undivided": "Znak Chaosu Niepodzielonego",
  "Mark of Khorne": "Znak Khorne'a",
  "Mark of Nurgle": "Znak Nurgle'a",
  "Mark of Slaanesh": "Znak Slaanesha",
  "Mark of Tzeentch": "Znak Tzeentcha",

  // === SPECIAL RULES ===
  "Ambushers": "Zasadzka",
  "Vanguard": "Awangarda",
  "Scouts": "Zwiadowcy",
  "Drilled": "Wyćwiczeni",
  "Frenzy": "Szał",
  "Open Order": "Szyk Otwarty",
  "Reserve Move": "Manewr Rezerwowy",
  "Shieldwall": "Mur Tarcz",
  "Move Through Cover": "Ruch Przez Ukrycie",
  "Skirmishers (Replaces Open Order)": "Harcownicy (Zastępuje Szyk Otwarty)",
  "Veteran (Replaces Valour of Ages)": "Weteran (Zastępuje Męstwo Wieków)",
  "Implacable Defence (0-1 per 1000 points)": "Nieugięta Obrona (0-1 na 1000 punktów)",
  "Nehekharan Phalanx": "Nehekharańska Falanga",
  "Nehekharan Phalanx (0-1 per 1000 points)": "Nehekharańska Falanga (0-1 na 1000 punktów)",
  "Reserve Move (0-1 per 1000 points)": "Manewr Rezerwowy (0-1 na 1000 punktów)",
  "Heavy Infantry, Phalanx": "Ciężka Piechota, Falanga",
  "Lance Formation, Noble Disdain": "Formacja Lancerska, Szlachetna Pogarda",
  "Noble Disdain, Veteran": "Szlachetna Pogarda, Weteran",
  "Stubborn, Tilean Stoicism": "Nieugięty, Tilejski Stoicyzm",
  "Feint & Dodge": "Zwód i Unik",
  "\"Hold the Line!\"": "\"Trzymać Pozycję!\"",
  "Frenzy (if 2 crew members)": "Szał (jeśli 2 członków załogi)",
  "Frenzy (if 3 crew members)": "Szał (jeśli 3 członków załogi)",
  "Warpaint": "Malowanie wojenne",
  "Warpaint (if frenzied)": "Malowanie wojenne (jeśli w szale)",
  "Nasty Skulkers": "Podstępni Skradacze",
  "Netters": "Sieciarze",
  "Regeneration (5+)": "Regeneracja (5+)",

  // === ARMOUR VARIATIONS ===
  "No armour": "Brak zbroi",
  "No armour, Shields": "Brak zbroi, Tarcze",
  "Light armour, Shields": "Lekka zbroja, Tarcze",
  "Heavy armour, Shields": "Ciężka zbroja, Tarcze",
  "Heavy armour, Shield": "Ciężka zbroja, Tarcza",
  "Heavy armour, Barding": "Ciężka zbroja, Zbroja dla wierzchowca",
  "Heavy armour, Shield, Barding": "Ciężka zbroja, Tarcza, Zbroja dla wierzchowca",
  "Full plate armour, Shields, Barding": "Pełna zbroja płytowa, Tarcze, Zbroja dla wierzchowca",
  "Full plate armour, Barding": "Pełna zbroja płytowa, Zbroja dla wierzchowca",
  "Heavy armour, Shields, Barding": "Ciężka zbroja, Tarcze, Zbroja dla wierzchowca",
  "Full plate armour, Shields": "Pełna zbroja płytowa, Tarcze",
  "Heavy armour (scaly skin)": "Ciężka zbroja (łuskowata skóra)",
  "Light armour (calloused hide)": "Lekka zbroja (zgrubiała skóra)",
  "Heavy armour (Scaly skin)": "Ciężka zbroja (Łuskowata skóra)",
  "Light armour (Calloused hide)": "Lekka zbroja (Zgrubiała skóra)",
  "Light armour (Calloused hide)*": "Lekka zbroja (Zgrubiała skóra)*",
  "Light armour (Calloused hides)": "Lekka zbroja (Zgrubiałe skóry)",
  "Calloused hides (Light armour)": "Zgrubiałe skóry (Lekka zbroja)",
  "Calloused hide (light armour)": "Zgrubiała skóra (lekka zbroja)",
  "Heavy armour (mutated hides)": "Ciężka zbroja (zmutowane skóry)",
  "Heavy armour (Bone carapace)": "Ciężka zbroja (Kostny pancerz)",
  "Heavy armour (Iridescent scales)": "Ciężka zbroja (Tęczowe łuski)",
  "Heavy armour (Terracotta armour)": "Ciężka zbroja (Zbroja terakotowa)",
  "Scaly skin (Heavy armour)": "Łuskowata skóra (Ciężka zbroja)",
  "Light armour (Calloused hide)": "Lekka zbroja (Zgrubiała skóra)",
  "Heavy armour, Full plate armour (Dragon Form)": "Ciężka zbroja, Pełna zbroja płytowa (Smocza Forma)",
  "Dragonhide Cloak, Heavy armour, Shield": "Płaszcz ze Smoczej Skóry, Ciężka zbroja, Tarcza",
  "The Armour of Skaldour, Shield": "Zbroja Skaldoura, Tarcza",
  "The Slayer Crown, Light armour": "Korona Zabójcy, Lekka zbroja",
  "Heavy armour, The Pelt of Charandis": "Ciężka zbroja, Skóra Charandis",

  // === SAVE VALUES ===
  "3+": "3+",
  "4+": "4+",
  "5+": "5+",
  "Stubborn": "Nieugięty",
  "Hatred": "Nienawiść",
  "Frenzy": "Furia",
  "Fear": "Strach",
  "Terror": "Przerażenie",
  "Immune to Psychology": "Odporność na psychologię",
  "Magic Resistance (1)": "Odporność na Magię (1)",
  "Magic Resistance (2)": "Odporność na Magię (2)",
  "Magic Resistance (3)": "Odporność na Magię (3)",
  "Ward Save (5+)": "Ochrona Magiczna (5+)",
  "Ward Save (6+)": "Ochrona Magiczna (6+)",

  // === UPGRADES ===
  "Veteran": "Weteran",
  "Experienced": "Doświadczony",
  "Elite": "Elita",
  "Flaming attacks": "Płonące ataki",
  "Poisoned attacks": "Trujące ataki",
  "Magical attacks": "Magiczne ataki",
  "Poisoned Attacks": "Trujące Ataki",

  // === ADDITIONAL WEAPONS ===
  "Throwing weapons": "Broń do rzucania",
  "Throwing spears": "Włócznie do rzucania",
  "Thrusting spears": "Włócznie kłująca",
  "Halberds": "Halabardy",
  "Flails": "Cepy",
  "Flail": "Cep",
  "Morning star": "Gwiazda poranna",
  "Slings": "Proce",
  "Sling": "Proca",
  "Harpoon launcher": "Wyrzutnia harpunów",
  "Additional hand weapon, Harpoon launcher": "Dodatkowa broń ręczna, Wyrzutnia harpunów",
  "Additional hand weapon, Sling": "Dodatkowa broń ręczna, Proca",
  "Additional hand weapon, Throwing weapons": "Dodatkowa broń ręczna, Broń do rzucania",
  "Additional hand weapons, Throwing weapons (mixed weapons)": "Dodatkowa broń ręczna, Broń do rzucania (mieszana broń)",
  "Throwing spears, Shield": "Włócznie do rzucania, Tarcza",
  "Throwing spears, Shields": "Włócznie do rzucania, Tarcze",
  "Thrusting spears, Shield": "Włócznie kłująca, Tarcza",
  "Thrusting spears, Shields": "Włócznie kłująca, Tarcze",
  "Throwing axes, Javelins": "Topory do rzucania, Oszczepy",
  "Hand weapons, Shield": "Broń ręczna, Tarcza",
  "Hand weapons, Shields": "Broń ręczna, Tarcze",
  "Hand weapons, Great weapons": "Broń ręczna, Wielka broń",
  "Hand weapons, Cavalry spears, Shields": "Broń ręczna, Włócznie kawalerii, Tarcze",
  "Hand weapons, Great weapons (Bestigor Crew), Cavalry spears (Gor Crew)": "Broń ręczna, Wielka broń (Załoga Bestigorów), Włócznie kawalerii (Załoga Gorów)",
  "Cavalry spears, Shields": "Włócznie kawalerii, Tarcze",
  "Cavalry spears, Longbows": "Włócznie kawalerii, Długie łuki",
  "Cavalry spears, Shortbows": "Włócznie kawalerii, Krótkie łuki",
  "Cavalry spears, Petrifying gaze": "Włócznie kawalerii, Kamieniejące spojrzenie",
  "Full plate armour, Barding": "Pełna zbroja płytowa, Zbroja dla wierzchowca",
  "Full plate armour, Shields, Barding": "Pełna zbroja płytowa, Tarcze, Zbroja dla wierzchowca",

  // === RANGED WEAPONS (Extended) ===
  "Longbows": "Długie łuki",
  "Shortbows": "Krótkie łuki",
  "Crossbows": "Kusze",
  "Crossbow/Handgun": "Kusza/Arkebuz",
  "Repeater handbows": "Powtarzalne ręczne łuki",
  "Brace of Repeater handbows": "Para powtarzalnych ręcznych łuków",
  "Blowpipe": "Dmuchawka",
  "Blowpipes": "Dmuchawki",
  "Blowpipes, Hand weapons": "Dmuchawki, Broń ręczna",
  "Handguns": "Arkebuzyz",
  "Blunderbusses": "Krótkie garłacze",
  "Hailshot blunderbuss": "Garłacz gradowy",
  "Brace of drakefire pistols": "Para smoczych pistolety",
  "Brace of Ogre pistols": "Para ogrich pistolety",
  "Brace of Ogre pistols (Crusher)": "Para ogrich pistolety (Miażdżyciela)",
  "Dragon fire pistol": "Smoczo-ognisty pistolet",
  "Bow of Avelorn": "Łuk z Avelorn",
  "Bows of Avelorn": "Łuki z Avelorn",

  // === ARMOUR (Extended) ===
  "No armour": "Bez zbroi",
  "Heavy armour (scaly skin)": "Ciężka zbroja (łuskowata skóra)",
  "Light armour (calloused hide)": "Lekka zbroja (zrogowaciała skóra)",
  "Calloused hide (light armour)": "Zrogowaciała skóra (lekka zbroja)",
  "Calloused hides (Light armour)": "Zrogowaciała skóra (Lekka zbroja)",
  "Blackshard Armour": "Zbroja Czarnego Odłamka",
  "Dragonhide Cloak, Heavy armour, Shield": "Płaszcz ze smoczej skóry, Ciężka zbroja, Tarcza",
  "Armoured Hide (1)": "Opancerzona Skóra (1)",
  "Barded Warhorse": "Opancerzony rumak bojowy",
  "Barded Warhorses": "Opancerzone rumaki bojowe",
  "Barded Elven Steed": "Opancerzony elficki rumak",
  "Barded Pegasus": "Opancerzony Pegaz",

  // === CHAMPIONS / CHARACTERS ===
  "Captain": "Kapitan",
  "Boss": "Szef",
  "Boss (champion)": "Szef (czempion)",
  "Bosun": "Bosman",
  "Chieftain's Chariot": "Rydwan Wodza",
  "Commander (champion)": "Dowódca (czempion)",
  "Crusher (champion)": "Miażdżyciel (czempion)",
  "Desperado (champion)": "Desperado (czempion)",
  "Esquire (champion)": "Giermek (czempion)",
  "Gallant (champion)": "Rycerz Galant (czempion)",
  "First Knight (champion)": "Pierwszy Rycerz (czempion)",
  "Bladelord": "Pan Ostrzy",
  "Draich Master (champion)": "Mistrz Draich (czempion)",
  "Dread Knight (champion)": "Rycerz Grozy (czempion)",
  "Demigryph Preceptor (champion)": "Preceptor Demigryfów (czempion)",
  "Chracian Captain (champion)": "Kapitan z Chracii (czempion)",
  "Count's Champion (champion)": "Czempion Hrabiego (czempion)",
  "Drakemaster": "Mistrz Smoków",
  "Crypt Ghast": "Ghast z Krypty",
  "Crypt Haunter": "Nawiedziciel z Krypty",
  "Ancient (champion)": "Prastarzy (czempion)",
  "Elder (champion)": "Starszy (czempion)",
  "Bellower (musician)": "Ryczący (muzyk)",
  "Clawleader (champion)": "Przywódca Pazurów (czempion)",
  "Fangleader (champion)": "Przywódca Kłów (czempion)",
  "Assassin": "Skrytobójca",

  // === BEASTMEN SPECIFIC ===
  "Gors": "Gory",
  "Ungors": "Ungory",
  "Ungor Ravagers": "Najeźdźcy Ungorów",
  "Braystaff": "Laska Braila",
  "Gorehoof": "Krwawokopiyt",
  "Shartak": "Shartak",
  "Bloodkine": "Krewne Krwi",
  "Bloodkine (champion)": "Krewne Krwi (czempion)",
  "Bloodshade (champion)": "Krwawy Cień (czempion)",
  "Foe-render (champion)": "Rozpruwacz Wrogów (czempion)",
  "Gouge-horn": "Wydrążone Rogi",
  "Half-horn": "Pół-Róg",
  "True-horn": "Prawdziwy Róg",
  "Splice-horn (champion)": "Rozszczepiany Róg (czempion)",
  "The Sons of Ghorros": "Synowie Ghorrosa",
  "Tuskgor Chariot": "Rydwan Tuskgora",
  "Razorgor Chariot": "Rydwan Brzytwogrów",
  "Giant's club": "Maczuga olbrzyma",
  "Wicked claws, Slythey tongue": "Nikczemne pazury, Śliski język",
  "Twisted antlers": "Poskręcane poroża",
  "Acidic vomit": "Kwaśne wymioty",
  "Cleaver-limbs": "Kończyny-siekiery",
  "Petrifying gaze": "Kamieniejące spojrzenie",
  "Chaos Mutations": "Mutacje Chaosu",
  "Chaos Mutations (Bloodkine)": "Mutacje Chaosu (Krewnych Krwi)",
  "Chaos Mutations (for Shartak)": "Mutacje Chaosu (dla Shartaka)",
  "Hand weapon (claws), Hurl attack": "Broń ręczna (pazury), Atak ciskany",
  "Hand weapon (flailing appendages)": "Broń ręczna (wymachujące kończyny)",
  "Hand weapon, Grisly Totem": "Broń ręczna, Makabryczny Totem",
  "Hand weapon, Mansmasher, The Skull of the Unicorn Lord": "Broń ręczna, Miażdżyciel Ludzi, Czaszka Pana Jednorożców",
  "Hand weapons (Claws and fangs)": "Broń ręczna (Pazury i kły)",
  "Hand weapons (Claws and fangs), Twisted antlers": "Broń ręczna (Pazury i kły), Poskręcane poroża",
  "Hand weapons (claws)": "Broń ręczna (pazury)",
  "Hand weapons (claws), Petrifying gaze": "Broń ręczna (pazury), Kamieniejące spojrzenie",
  "Hand weapons (tusks)": "Broń ręczna (kły)",
  "Claws and fangs (Hand weapon)": "Pazury i kły (Broń ręczna)",
  "Claws and fangs (Hand weapons)": "Pazury i kły (Broń ręczna)",

  // === CHAOS DWARFS SPECIFIC ===
  "Ba'hal": "Ba'hal",
  "Bale Taurus": "Bale Taurus",
  "Great Taurus": "Wielki Taurus",
  "Great Taurus {renegade}": "Wielki Taurus {renegade}",
  "Blood of Hashut": "Krew Hashuta",
  "Darkforged weapon": "Broń wykuta w mroku",
  "Fireglaive": "Ognista glewia",
  "Fireglaives": "Ogniste glewie",
  "Black Orc Boar Chariot": "Rydwan Dzików Czarnych Orków",
  "Boar Chariot": "Rydwan Dzików",
  "Deathmask (champion)": "Maska Śmierci (czempion)",
  "Feigned Flight": "Udawany odwrót",
  "Feigned Flight (0-1 per 1000 points)": "Udawany odwrót (0-1 na 1000 punktów)",
  "Giant Wolf": "Olbrzymi Wilk",
  "Demolition Rockets, Infernal Incendiaries, Hand weapons": "Rakiety burzące, Infernalne podpałki, Broń ręczna",
  "Doomfire, Hand weapons": "Ogień zagłady, Broń ręczna",
  "Fire thrower, Hand weapons": "Miotacz ognia, Broń ręczna",
  "Dreadquake Mortar, Hand weapons": "Moździerz Straszliwego Wstrząsu, Broń ręczna",
  "Bolt thrower, Hand weapons": "Balista, Broń ręczna",
  "Cannon, Hand weapons": "Armata, Broń ręczna",
  "Bombard, Hand weapons": "Bombarda, Broń ręczna",
  "Fire rain rocket, Hand weapons": "Rakieta deszczu ognia, Broń ręczna",
  "Field Trebuchet, Hand weapons": "Trebusz polowy, Broń ręczna",
  "Cannon of the Sky-titans {renegade}, Hand weapons": "Armata Tytanów Nieba {renegade}, Broń ręczna",
  "Furnace hammer, Rivet gun": "Młot piecowy, Pistolet nitujący",

  // === CHAOS SPAWNS ===
  "Spawn of Khorne": "Pomiot Khorne'a",
  "Spawn of Nurgle": "Pomiot Nurgle'a",
  "Spawn of Slaanesh": "Pomiot Slaanesha",
  "Spawn of Tzeentch": "Pomiot Tzeentcha",
  "Forsaken by Khorne": "Opuszczeni przez Khorne'a",
  "Forsaken by Nurgle": "Opuszczeni przez Nurgle'a",
  "Forsaken by Slaanesh": "Opuszczeni przez Slaanesha",
  "Forsaken by Tzeentch": "Opuszczeni przez Tzeentcha",

  // === MOUNTS (Extended) ===
  "Empire Warhorse": "Rumak bojowy Imperium",
  "Empire warhorse": "Rumak bojowy Imperium",
  "Empire War Wagon": "Wóz Wojenny Imperium",
  "Bretonnian Warhorse": "Bretoński rumak bojowy",
  "Cathayan Warhorse": "Rumak bojowy Cathay",
  "Elven Steed": "Elficki rumak",
  "Dark Steed": "Mroczny rumak",
  "Dark Pegasus": "Mroczny Pegaz",
  "Chaos Steed": "Rumak Chaosu",
  "Daemonic Mount": "Demoniczny wierzchowiec",
  "Doom Wolf": "Wilk Zagłady",
  "Cold One {dark elves}": "Zimny {mroczne elfy}",
  "Cold One {lizardmen}": "Zimny {jaszczuroludy}",
  "Cold One Chariot": "Rydwan na Zimnych",
  "Chaos Chariot": "Rydwan Chaosu",
  "Chosen Chaos Chariot": "Rydwan Wybranych Chaosu",
  "Demigryph": "Demigryf",
  "Black Dragon": "Czarny Smok",
  "Chaos Dragon": "Smok Chaosu",
  "Carnosaur": "Karnozaur",
  "Ancient Stegadon": "Pradawny Stegadon",
  "Arachnarok Spider": "Pająk Arachnarok",
  "Giant Cave Squig": "Olbrzymi Jaskiniowy Squig",
  "Abyssal Terror": "Otchłanny Postrach",
  "Flamespyre Phoenix {mount}": "Feniks Płomiennej Pyry {wierzchowiec}",
  "Frostheart Phoenix {mount}": "Feniks Mroźnego Serca {wierzchowiec}",
  "Mangler Squigs": "Squigi Miażdżyciele",

  // === MAGIC ITEMS / EQUIPMENT ===
  "Magic Items": "Magiczne przedmioty",
  "Ceremonial halberd": "Ceremonialna halabarda",
  "Ceremonial halberds": "Ceremonialne halabardy",
  "Chracian great blade": "Wielkie ostrze z Chracii",
  "Chracian great blades": "Wielkie ostrza z Chracii",
  "Celestial blade": "Niebiańskie ostrze",
  "Celestial blade, Iron talons": "Niebiańskie ostrze, Żelazne szpony",
  "Cathayan lance (if appropriately mounted)": "Lanca Cathay (jeśli odpowiednio dosiadany)",
  "Cathayan lance, Iron talons": "Lanca Cathay, Żelazne szpony",
  "Cavalry spear (if appropriately mounted)": "Włócznia kawalerii (jeśli odpowiednio dosiadany)",
  "Cleaving blades, Decapitating strike": "Rozłupujące ostrza, Ścięcie",
  "Decapitating claws, Envenomed sting": "Ścinające pazury, Zatrute żądło",
  "Envenomed sting": "Zatrute żądło",
  "Fiend tail": "Diabelski ogon",
  "Colossal fang-filled gob": "Kolosalna paszcza pełna kłów",
  "Cavernous maw, Writhing tentacles {dark elves}, Hand weapons, Whips": "Jaskiniowa paszcza, Wijące się macki {mroczne elfy}, Broń ręczna, Bicze",
  "Filth-encrusted claws": "Brudne pazury",
  "Filth-encrusted talons, Rancid maw": "Brudne szpony, Zgnilizna paszcza",
  "Burning Braziers": "Płonące Kadłubki",
  "Balefire Brazier": "Kadłubek Bladego Ognia",
  "Blessed Triptych": "Błogosławiony Tryptyk",
  "Butcher's Cauldron": "Kocioł Rzeźnika",
  "Coven Throne": "Tron Sabatu",
  "Cauldron of Blood {renegade}": "Kocioł Krwi {renegade}",
  "Dragonfire bombs": "Bomby smoczego ognia",
  "Cinderblast bombs": "Bomby żużlowe",
  "Blasting Charges": "Ładunki wybuchowe",
  "Defensive Stakes": "Obronne pale",
  "Drakegun": "Smoczy pistolet",
  "Eagle-Eye Bolt Thrower": "Balista Orlego Oka",
  "Engine of the Gods": "Silnik Bogów",

  // === FORMATIONS / SPECIAL RULES (Extended) ===
  "Close Order": "Zwarty Szyk",
  "Close Order, Horde": "Zwarty Szyk, Horda",
  "Formation": "Formacja",
  "Horde": "Horda",
  "Skirmishers": "Harcownicy",
  "Ambushers, Skirmishers": "Zasadzka, Harcownicy",
  "Detachment": "Oddział",
  "Drilled (0-1 per 1000 points)": "Wyćwiczeni (0-1 na 1000 punktów)",
  "Counter Charge": "Przeciwnatarcie",
  "Fire & Flee": "Ogień i odwrót",
  "Feint & Dodge": "Finta i unik",
  "Frenzy (if 2 crew members)": "Furia (jeśli 2 członków załogi)",
  "Frenzy (if 3 crew members)": "Furia (jeśli 3 członków załogi)",
  "Regeneration (6+)": "Regeneracja (6+)",
  "Fly (9)": "Lot (9)",
  "Flaming Breath {warriors of chaos}": "Płonący oddech {wojownicy chaosu}",
  "Fiery roar": "Ognisty ryk",
  "Function over form": "Funkcja ważniejsza od formy",
  "Big 'Uns": "Wielcy",
  "Big Stabbas": "Wielkie Sztychery",
  "Fanatic ball & chain": "Fanatyczny kij z kulą",
  "Arise!, Level 1 Wizard": "Powstań!, Czarodziej poziomu 1",
  "\"Hold the Line!\"": "\"Utrzymać linię!\"",
  "+1 to Weapon Skill": "+1 do Umiejętności Walki",
  "3+": "3+",
  "4+": "4+",
  "5+": "5+",

  // === LIZARDMEN SPECIFIC ===
  "Fourth Skink crew member": "Czwarty członek załogi Skinków",
  "Chariot Runners": "Biegacze Rydwanu",
  "Celestial Dragon Guard": "Straż Niebiańskiego Smoka",

  // === TOMB KINGS SPECIFIC ===
  "Additional Tomb Guard Crew #1": "Dodatkowy członek załogi Straży Grobowców #1",
  "Additional Tomb Guard Crew #2": "Dodatkowy członek załogi Straży Grobowców #2",

  // === MISC ===
  "Expeditionary Marksman": "Ekspedycyjny Strzelec",
  "Expeditionary Marksmen": "Ekspedycyjni Strzelcy",
  "Doomseeker": "Szukający Zagłady",
  "Magic Items": "Magiczne Przedmioty",

  // === CHAMPIONS (All Armies) ===
  "Boss": "Szef",
  "Boss (champion)": "Szef (czempion)",
  "Captain": "Kapitan",
  "Captain (champion)": "Kapitan (czempion)",
  "Elder (champion)": "Starszy (czempion)",
  "Herald (champion)": "Herold (czempion)",
  "Master (champion)": "Mistrz (czempion)",
  "Veteran (champion)": "Weteran (czempion)",
  "Sergeant (champion)": "Sierżant (czempion)",
  "Veteran Sergeant (champion)": "Weterani Sierżant (czempion)",
  "Commander (champion)": "Dowódca (czempion)",
  "Veteran Commander (champion)": "Weterani Dowódca (czempion)",
  "Officer (champion)": "Oficer (czempion)",
  "Veteran Officer (champion)": "Weterani Oficer (czempion)",
  "Marksman (champion)": "Strzelec (czempion)",
  "Sharpshooter (champion)": "Snajper (czempion)",
  "Militia leader (champion)": "Przywódca milicji (czempion)",
  "Preceptor (champion)": "Preceptor (czempion)",
  "Inner Circle Preceptor (champion)": "Preceptor Wewnętrznego Kręgu (czempion)",
  "Demigryph Preceptor (champion)": "Preceptor Demigryfa (czempion)",
  "First Knight (champion)": "Pierwszy Rycerz (czempion)",
  "Count's Champion (champion)": "Czempion Hrabiego (czempion)",
  "Desperado (champion)": "Desperado (czempion)",
  "Prophet of Doom (champion)": "Prorok Zagłady (czempion)",
  "Esquire (champion)": "Giermek (czempion)",
  "Gallant (champion)": "Dzielny (czempion)",
  "Paragon (champion)": "Wzór (czempion)",
  "Villein (champion)": "Chłop (czempion)",
  "Warden (champion)": "Strażnik (czempion)",
  "Yeoman (champion)": "Wolny chłop (czempion)",
  "Grail Guardian (champion)": "Strażnik Graala (czempion)",
  "Ancient (champion)": "Pradawny (czempion)",
  "Pack Leader (champion)": "Przywódca Stada (czempion)",
  "Patrol Leader (champion)": "Przywódca Patrolu (czempion)",
  "Revered Guardian (champion)": "Czczony Strażnik (czempion)",
  "Sky Leader (champion)": "Przywódca Niebios (czempion)",
  "Spawn Leader (champion)": "Przywódca Pomiotów (czempion)",
  "Crusher (champion)": "Miażdżyciel (czempion)",
  "Groinbiter (champion)": "Kasztaniarz (czempion)",
  "Gutlord (champion)": "Pan Jelita (czempion)",
  "Maneater Captain (champion)": "Kapitan Ludojadów (czempion)",
  "Snarefinger (champion)": "Chwytacz (czempion)",
  "Thunderfist (champion)": "Gromowładna Pięść (czempion)",
  "Clawleader (champion)": "Przywódca Pazurów (czempion)",
  "Fangleader (champion)": "Przywódca Kłów (czempion)",
  "Master Moulder (champion)": "Mistrz Moulder (czempion)",
  "Master Charioteer (champion)": "Mistrz Rydwanu (czempion)",
  "Master of Arms (champion)": "Mistrz Oręża (czempion)",
  "Master of Arrows (champion)": "Mistrz Strzał (czempion)",
  "Master of Horse (champion)": "Mistrz Koni (czempion)",
  "Necropolis Captain (champion)": "Kapitan Nekropolii (czempion)",
  "Tomb Captain (champion)": "Kapitan Grobowca (czempion)",
  "Venerable Ancient": "Czcigodny Pradawny",
  "Skeleton Champion": "Szkieletowy Czempion",
  "Hell Knight": "Rycerz Piekieł",
  "Hellwraith": "Widmo Piekieł",
  "Kastellan": "Kasztelan",
  "Seneschal": "Seneszal",
  "Marauder Chieftain": "Wódz Hufców",
  "Marauder Horsemaster": "Mistrz Koni Hufców",
  "Handler": "Opiekun",
  "Bloodkine": "Krewniak Krwi",
  "Bloodkine (champion)": "Krewniak Krwi (czempion)",
  "Foe-render (champion)": "Rozdzieracz Wrogów (czempion)",
  "Gorehoof": "Krwawe Kopyto",
  "Gouge-horn": "Rozdział Róg",
  "Half-horn": "Półróg",
  "Splice-horn (champion)": "Rozszczepionyróg (czempion)",
  "Shartak": "Shartak",
  "True-horn": "Prawdziwyróg",
  "Deathmask (champion)": "Maska Śmierci (czempion)",
  "Manburner (champion)": "Palacz Ludzi (czempion)",
  "Murder Boss (champion)": "Mordowaty Szef (czempion)",
  "Overseer (champion)": "Nadzorca (czempion)",
  "Bloodshade (champion)": "Krwawcień (czempion)",
  "Draich Master (champion)": "Mistrz Draich (czempion)",
  "Dread Knight (champion)": "Straszny Rycerz (czempion)",
  "Hag (champion)": "Wiedźma (czempion)",
  "Lordling (champion)": "Młody Lord (czempion)",
  "Reaver (champion)": "Łupieżca (czempion)",
  "Tower Master (champion)": "Mistrz Wieży (czempion)",
  "Ironbeard (champion)": "Żelaznobrody (czempion)",
  "Ironwarden (champion)": "Żelazny Strażnik (czempion)",
  "Ol' Deadeye (champion)": "Stary Trafnoczek (czempion)",
  "Prospector (champion)": "Poszukiwacz (czempion)",
  "Shrine Keeper (champion)": "Strażnik Kaplicy (czempion)",
  "Royal Champion": "Królewski Czempion",
  "Royal Clan Veteran": "Weteran Królewskiego Klanu",
  "Jade Lancer Officer (champion)": "Oficer Nefritowych Lancerów (czempion)",
  "Jade Officer (champion)": "Oficer Nefrytowy (czempion)",
  "Chracian Captain (champion)": "Kapitan Chracjański (czempion)",
  "High Helm (champion)": "Wysoki Hełm (czempion)",
  "High Sister": "Wysoka Siostra",
  "Lion Guard Captain (champion)": "Kapitan Straży Lwa (czempion)",
  "Sea Master (champion)": "Mistrz Morza (czempion)",
  "Sentinel (champion)": "Wartownik (czempion)",
  "Shadow Walker": "Wędrowiec Cieni",
  "Bladelord": "Pan Ostrzy",
  "Bosun": "Bosman",
  "Drakemaster": "Mistrz Smoków",
  "Guardian": "Strażnik",
  "Harbinger (champion)": "Zwiastun (czempion)",
  "Keeper of the Flame": "Strażnik Płomienia",
  "Midshipman": "Chorąży",
  "Bellower (musician)": "Ryczący (muzyk)",
  "Ripperdactyl Champion": "Czempion Riperdaktyla",
  "Squig Herder": "Pasterz Squigów",
  "Orc Bully, Whip": "Orczy Tyran, Bat",
  "Third Orc crew member": "Trzeci członek orczej załogi",
  "Third Giant Wolf": "Trzeci Gigantyczny Wilk",
  "Crypt Ghast": "Upiór Krypty",
  "Crypt Haunter": "Nawiedzający Kryptę",

  // === WEAPON COMBINATIONS (Missing) ===
  "Hand weapon, Additional hand weapon": "Broń ręczna, Dodatkowa broń ręczna",
  "Hand weapon, Great weapon": "Broń ręczna, Wielka broń",
  "Hand weapon, Throwing weapons": "Broń ręczna, Broń do rzucania",
  "Hand weapon, Thrusting spear": "Broń ręczna, Włócznia kłująca",
  "Hand weapon, Sling": "Broń ręczna, Proca",
  "Hand weapon, Warplock musket": "Broń ręczna, Muszkiet warpowy",
  "Hand weapon, Warplock pistol": "Broń ręczna, Pistolet warpowy",
  "Hand weapon, Plague censer": "Broń ręczna, Kadzielnica zarazy",
  "Hand weapon, Longbow": "Broń ręczna, Długi łuk",
  "Hand weapon, Warbow": "Broń ręczna, Łuk bojowy",
  "Hand weapon, Petrifying gaze": "Broń ręczna, Kamienne spojrzenie",
  "Hand weapon, Whip": "Broń ręczna, Bat",
  "Hand weapons, Additional hand weapon": "Broń ręczna, Dodatkowa broń ręczna",
  "Hand weapons, Additional hand weapons": "Broń ręczna, Dodatkowa broń ręczna",
  "Hand weapons, Great weapons": "Broń ręczna, Wielka broń",
  "Hand weapons, Halberds": "Broń ręczna, Halabardy",
  "Hand weapons, Halberds, Shields": "Broń ręczna, Halabardy, Tarcze",
  "Hand weapons, Shortbows": "Broń ręczna, Krótkie łuki",
  "Hand weapons, Longbows": "Broń ręczna, Długie łuki",
  "Hand weapons, Warbows": "Broń ręczna, Łuki bojowe",
  "Hand weapons, Crossbows": "Broń ręczna, Kusze",
  "Hand weapons, Handguns": "Broń ręczna, Arkeb uzy",
  "Hand weapons, Throwing weapons": "Broń ręczna, Broń do rzucania",
  "Hand weapons, Throwing axes": "Broń ręczna, Topory do rzucania",
  "Hand weapons, Javelins": "Broń ręczna, Oszczepy",
  "Hand weapons, Javelins, Shields": "Broń ręczna, Oszczepy, Tarcze",
  "Hand weapons, Lances": "Broń ręczna, Lance",
  "Hand weapons, Lances, Shields": "Broń ręczna, Lance, Tarcze",
  "Hand weapons, Cavalry spears": "Broń ręczna, Włócznie kawalerii",
  "Hand weapons, Cavalry spears, Shields": "Broń ręczna, Włócznie kawalerii, Tarcze",
  "Hand weapons, Cavalry spears, Shortbows": "Broń ręczna, Włócznie kawalerii, Krótkie łuki",
  "Hand weapons, Cavalry spears, Longbows": "Broń ręczna, Włócznie kawalerii, Długie łuki",
  "Hand weapons, Cavalry spears, Repeater crossbows": "Broń ręczna, Włócznie kawalerii, Powtarzalne kusze",
  "Hand weapons, Thrusting spears, Shields": "Broń ręczna, Włócznie kłująca, Tarcze",
  "Hand weapons, Thrusting spears, Warbows": "Broń ręczna, Włócznie kłująca, Łuki bojowe",
  "Hand weapons, Polearms": "Broń ręczna, Broń drzewcowa",
  "Hand weapons, Polearms, Shields": "Broń ręczna, Broń drzewcowa, Tarcze",
  "Hand weapons, Thrusting spears": "Broń ręczna, Włócznie kłująca",
  "Hand weapons, Great weapons, Shields": "Broń ręczna, Wielka broń, Tarcze",
  "Hand weapons, Flails": "Broń ręczna, Cepy",
  "Hand weapons, Repeater crossbows": "Broń ręczna, Powtarzalne kusze",
  "Hand weapons, Repeater crossbows, Additional hand weapons": "Broń ręczna, Powtarzalne kusze, Dodatkowa broń ręczna",
  "Hand weapons, Repeater crossbows, Great weapons": "Broń ręczna, Powtarzalne kusze, Wielka broń",
  "Hand weapons, Repeater handbows": "Broń ręczna, Powtarzalne łuki ręczne",
  "Hand weapons, Dread halberds": "Broń ręczna, Halabardy grozy",
  "Hand weapons, Har Ganeth greatswords": "Broń ręczna, Wielkie miecze Har Ganeth",
  "Hand weapons, Lash & buckler": "Broń ręczna, Bicz i puklerz",
  "Hand weapons, Brace of pistols": "Broń ręczna, Para pistoletów",
  "Hand weapons, Pistols, Repeater handguns": "Broń ręczna, Pistolety, Powtarzalne arkebuz y",
  "Hand weapons, Wolf hammers": "Broń ręczna, Wilcze młoty",
  "Hand weapons, Wolf hammers, Shields": "Broń ręczna, Wilcze młoty, Tarcze",
  "Hand weapons, Assorted weapons, Blunderbuss, Long rifle, Repeating rifle, Ball & chain, Hooked halberd, Man-catcher": "Broń ręczna, Różnorodna broń, Garłacz, Długi karabin, Powtarzalny karabin, Kula z łańcuchem, Haczykowata halabarda, Łapacz ludzi",
  "Hand weapons, Crossbows, Throwing axes": "Broń ręczna, Kusze, Topory do rzucania",
  "Hand weapons, Great hammers": "Broń ręczna, Wielkie młoty",
  "Hand weapons, Gromril great axes": "Broń ręczna, Gromrylowe wielkie topory",
  "Hand weapons, Miner's Cart": "Broń ręczna, Wózek górnika",
  "Hand weapons, Bugman's Cart": "Broń ręczna, Wózek Bugmana",
  "Hand weapons, Brimstone gun": "Broń ręczna, Siarkowe działo",
  "Hand weapons, Brimstone guns": "Broń ręczna, Siarkowe działa",
  "Hand weapons, Clattergun": "Broń ręczna, Grzechotnik",
  "Hand weapons, Clatterguns": "Broń ręczna, Grzechotnki",
  "Hand weapons, Drakeguns": "Broń ręczna, Smocze działa",
  "Hand weapons, Steam gun {dwarfs}": "Broń ręczna, Parowe działo {krasnoludy}",
  "Hand weapons, Chracian great blades": "Broń ręczna, Wielkie ostrza Chracii",
  "Hand weapons, Great blade": "Broń ręczna, Wielkie ostrze",
  "Hand weapons, Cathayan lances, Shields": "Broń ręczna, Lance Cathay, Tarcze",
  "Hand weapons, Blowpipes": "Broń ręczna, Dmuchawki",
  "Hand weapons, Fireleech bolas": "Broń ręczna, Ogniste bolas",
  "Hand weapons, Javelins, Great horns, Engine of the Gods": "Broń ręczna, Oszczepy, Wielkie rogi, Silnik Bogów",
  "Hand weapons, Javelins, Great horns, Engine of the Gods {renegade}": "Broń ręczna, Oszczepy, Wielkie rogi, Silnik Bogów {renegaci}",
  "Hand weapons, Javelins, Great horns, Giant blowpipes": "Broń ręczna, Oszczepy, Wielkie rogi, Gigantyczne dmuchawki",
  "Hand weapons, Javelins, Great horns, Giant bow": "Broń ręczna, Oszczepy, Wielkie rogi, Gigantyczny łuk",
  "Hand weapons, Javelins, Thunderous bludgeon, Ark of Sotek": "Broń ręczna, Oszczepy, Grzmiący maczuga, Arka Soteka",
  "Hand weapons, Javelins, Thunderous bludgeon, Solar Engine": "Broń ręczna, Oszczepy, Grzmiący maczuga, Słoneczny Silnik",
  "Hand weapons, Throwing weapons (Sharp stuff)": "Broń ręczna, Broń do rzucania (Ostre rzeczy)",
  "Hand weapons, Leadbelcher guns {renegade}": "Broń ręczna, Działa Leadbelcher {renegaci}",
  "Hand weapons, Plague censers": "Broń ręczna, Kadzielnice zarazy",
  "Hand weapons, Ritual blades": "Broń ręczna, Rytualne ostrza",
  "Hand weapons, Greatbows": "Broń ręczna, Wielkie łuki",
  "Hand weapons, Great weapons, Skeletal hooves (Hand weapons)": "Broń ręczna, Wielka broń, Szkieletowe kopyta (Broń ręczna)",
  "Hand weapons, Lances, Iron-shod hooves": "Broń ręczna, Lance, Żelazne kopyta",
  "Hand weapons, Skeletal hooves": "Broń ręczna, Szkieletowe kopyta",
  "Two hand weapons": "Dwie bronie ręczne",
  "Two hand weapons, Throwing weapons": "Dwie bronie ręczne, Broń do rzucania",
  "Two hand weapons, Sling": "Dwie bronie ręczne, Proca",
  "Hand weapons (Claws)": "Broń ręczna (Pazury)",
  "Hand weapons (Claws and teeth)": "Broń ręczna (Pazury i zęby)",
  "Hand weapons (Claws, fangs, tusks, teeth)": "Broń ręczna (Pazury, kły, ciosy, zęby)",
  "Hand weapons (Beaks and talons)": "Broń ręczna (Dzioby i szpony)",
  "Hand weapons (Lashing tails)": "Broń ręczna (Uderzające ogony)",
  "Hand weapons (Venomous bites and stings)": "Broń ręczna (Jadowite ugryzienia i ukłucia)",
  "Hand weapons (both), Cavalry spears (Horsemen), Warbows (Horse Archers)": "Broń ręczna (obie), Włócznie kawalerii (Jeźdźcy), Łuki bojowe (Jeźdźcy łucznicy)",
  "Hand weapons (both), Thrusting spears (Warriors), Warbows (Archers)": "Broń ręczna (obie), Włócznie kłująca (Wojownicy), Łuki bojowe (Łucznicy)",
  "Lances, Shields": "Lance, Tarcze",
  "Lances, Skeletal hooves": "Lance, Szkieletowe kopyta",
  "Lance (when mounted)": "Lanca (gdy dosiadający)",
  "Flailing appendages (Hand weapons)": "Uderzające kończyny (Broń ręczna)",
  "Mutated weapons (Hand weapons)": "Zmutowana broń (Broń ręczna)",
  "Great weapons (replace shields)": "Wielka broń (zastępuje tarcze)",
  "Paired great khopeshes": "Sparowane wielkie khopesze",

  // === SPECIAL CHARACTER EQUIPMENT ===
  "Hand weapon, Beast Reaver": "Broń ręczna, Bestia Grabieżca",
  "Hand weapon, Judgement, The Griffon Helm": "Broń ręczna, Wyrok, Hełm Gryfa",
  "Hand weapon, Grudge-settler, The Grudgestone": "Broń ręczna, Rozjemca Urazy, Kamień Urazy",
  "Hand weapon, The Axe of Dargo": "Broń ręczna, Topór Dargo",
  "Hand weapon, Chayal": "Broń ręczna, Chayal",
  "Hand weapon, Handmaiden's spear, Bow of Avelorn": "Broń ręczna, Włócznia Służebnej, Łuk Avelornu",
  "Hand weapon, Mathlann's Ire, Warbow": "Broń ręczna, Gniew Mathlanna, Łuk bojowy",
  "Hand weapon, Chalice of Brionne, The Staff of the Elements": "Broń ręczna, Kielich Brionne, Laska Żywiołów",
  "Hand weapon, Lances, Shields": "Broń ręczna, Lance, Tarcze",
  "Hand weapon, Swarming Mass": "Broń ręczna, Rosnąca Masa",
  "Hand weapon, Flaming breath {ogre kingdoms}": "Broń ręczna, Płonący oddech {królestwa ogrów}",
  "Hand weapon, Great tusks (Thundertusk), Chill breath (Thundertusk), Harpoon launcher (Ogre Crew), Blood vulture (Ogre Beast Rider)": "Broń ręczna, Wielkie kły (Gromogur), Lodowaty oddech (Gromogur), Wyrzutnia harpunów (Załoga Ogrów), Krwawy sęp (Jeździec bestii ogrów)",
  "Hand weapon, Great tusks (Thundertusk), Chill breath (Thundertusk), Harpoon launcher (Ogre Crew), Chaintrap (Ogre Beast Rider)": "Broń ręczna, Wielkie kły (Gromogur), Lodowaty oddech (Gromogur), Wyrzutnia harpunów (Załoga Ogrów), Pułapka łańcuchowa (Jeździec bestii ogrów)",
  "Hand weapon, Horns of stone (Stonehorn), Harpoon launcher (Ogre Crew), Blood vulture (Ogre Beast Rider)": "Broń ręczna, Kamienne rogi (Kamienioróg), Wyrzutnia harpunów (Załoga Ogrów), Krwawy sęp (Jeździec bestii ogrów)",
  "Hand weapon, Horns of stone (Stonehorn), Harpoon launcher (Ogre Crew), Chaintrap (Ogre Beast Rider)": "Broń ręczna, Kamienne rogi (Kamienioróg), Wyrzutnia harpunów (Załoga Ogrów), Pułapka łańcuchowa (Jeździec bestii ogrów)",
  "Hand weapon, Iron talons": "Broń ręczna, Żelazne szpony",
  "Hand weapon (poisonous fangs), Venom surge, Hand weapons, Cavalry spears, Shortbows": "Broń ręczna (jadowite kły), Fala trucizny, Broń ręczna, Włócznie kawalerii, Krótkie łuki",
  "Hand weapon, Warpstone Tokens (D3)": "Broń ręczna, Żetony kamienia osnowy (K3)",
  "Warpstone Tokens (D3)": "Żetony kamienia osnowy (K3)",
  "Hand weapon, Grisly Totem": "Broń ręczna, Makabryczny Totem",

  // === WAR MACHINES & CREWS ===
  "Great cannon, Hand weapons": "Wielka armata, Broń ręczna",
  "Grand cannon, Hand weapons": "Wielka armata, Broń ręczna",
  "Helblaster Volley Gun {weapon}, Hand weapons": "Helblaster Salwowe Działo {broń}, Broń ręczna",
  "Helstorm Rocket Battery {weapon}, Hand weapons": "Helstorm Bateria Rakiet {broń}, Broń ręczna",
  "Mortar, Hand weapons": "Moździerz, Broń ręczna",
  "Stone thrower, Hand weapons": "Miotacz kamieni, Broń ręczna",
  "Organ gun, Hand weapons": "Organek, Broń ręczna",
  "Goblin-hewer, Hand weapons": "Goblin-ciosa cz, Broń ręczna",
  "Steam Cannon, Steam gun {empire}": "Parowa Armata, Parowe działo {imperium}",
  "Repeater bolt thrower, Hand weapons": "Powtarzalna balista, Broń ręczna",
  "Plagueclaw Catapult, Hand weapons": "Katapulta Zarazowego Szponu, Broń ręczna",
  "Warp Lightning Cannon {renegade}, Hand weapons": "Działo Warpowego Błyskawicy {renegaci}, Broń ręczna",
  "Screaming Skull Catapult": "Katapulta Wrzeszczącej Czaszki",
  "Scraplauncher catapult, Hand weapons": "Katapulta Śmieciomiot, Broń ręczna",
  "Skullcracker, Hand weapons": "Łamacz Czaszek, Broń ręczna",
  "Steam Cannonade, Hand weapons": "Parowa Kanonade, Broń ręczna",
  "Ogre Loader": "Ładowniczy Ogr",
  "Third Orc crew member": "Trzeci członek orczej załogi",
  "Fourth Skink crew member": "Czwarty członek załogi Skinków",
  "Shieldbearers": "Nosiciele Tarcz",
  "Skink Handlers with Hand weapons and Light armour (Calloused hides)": "Opiekunowie Skinki z Bronią ręczną i Lekką zbroją (Zgrubiałe skóry)",
  "Skink Oracle with Hand weapon": "Wyrocznia Skinków z Bronią ręczną",
  "Packmaster, Things-catcher": "Mistrz Stada, Łapacz rzeczy",
  "Packmaster, Whip": "Mistrz Stada, Bat",
  "Whip": "Bat",
  "May add up to two additional Tomb Guard Crew": "Może dodać do dwóch dodatkowych członków Straży Grobowców",

  // === ADVANCED RANGED WEAPONS ===
  "Repeater handbow": "Powtarzalny łuk ręczny",
  "Repeater handgun": "Powtarzalny arkebuz",
  "Repeater pistol": "Powtarzalny pistolet",
  "Hochland long rifle": "Długi karabin hochlandzki",
  "Grenade launching blunderbuss": "Garłacz wyrzutnia granatów",
  "Warplock jezzail": "Jezail warpowy",
  "Crossbow/Handgun": "Kusza/Arkebuz",
  "Crossbows": "Kusze",
  "Handguns": "Arkeb uzy",
  "Pistols": "Pistolety",
  "Ogre pistol": "Pistloe t ogra",
  "Ogre pistols": "Pistolety ogrów",
  "Brace of drakefire pistols": "Para smoczy ch pistoletów ogniowych",
  "Longbow": "Długi łuk",
  "Longbows": "Długie łuki",
  "Shortbow": "Krótki łuk",
  "Warbow": "Łuk bojowy",
  "Warbows": "Łuki bojowe",
  "Giant blowpipes": "Gigantyczne dmuchawki",
  "Giant bow": "Gigantyczny łuk",
  "Thrusting spears": "Włócznie kłująca",
  "Thrusting spears for Squig Herder": "Włócznie kłująca dla Pasterza Squigów",
  "Naptha bombs": "Bomby naftowe",
  "Pigeon bombs": "Bomby gołębie",
  "Dragon fire bombs": "Bomby smoczego ognia",
  "Gunpowder bombs": "Bomby prochowe",
  "Cinderblast bombs": "Bomby popiołowybuchowe",
  "Iron hail guns, Dragon fire bombs": "Działa żelaznego gradu, Bomby smoczego ognia",
  "Iron hail guns, Gunpowder bombs": "Działa żelaznego gradu, Bomby prochowe",
  "Sky Lantern bombs": "Bomby Latarni Niebieskiej",
  "Sky Lantern Crane Guns": "Działa Dźwigu Latarni Niebieskiej",

  // === MOUNTS (Extended) ===
  "Barded Warhorse": "Opancerzony rumak bojowy",
  "Barded Warhorses": "Opancerzone rumaki bojowe",
  "Empire Warhorse": "Rumak bojowy Imperium",
  "Empire warhorse": "Rumak bojowy Imperium",
  "Bretonnian Warhorse": "Bretońsk i rumak bojowy",
  "Cathayan Warhorse": "Rumak bojowy Cathay",
  "Warhorse {bretonnia}": "Rumak bojowy {bretonnia}",
  "Warhorses": "Rumaki bojowe",
  "Barded Elven Steed": "Opancerzony elficki rumak",
  "Elven Steed": "Elficki rumak",
  "Dark Steed": "Mroczny rumak",
  "Skeletal Steed {tomb kings}": "Szkieletowy rumak {królowie grobowców}",
  "Skeletal Steed {vampire counts}": "Szkieletowy rumak {hrabiowie wampirów}",
  "Chaos Steed": "Rumak Chaosu",
  "Daemonic Mount": "Demoniczny wierzchowiec",
  "Cold One {dark elves}": "Zimny {mroczne elfy}",
  "Cold One {lizardmen}": "Zimny {jaszczuroludzie}",
  "War Boar": "Dzik bojowy",
  "Giant Wolf": "Gigantyczny wilk",
  "Gigantic Spider": "Gigantyczny pająk",
  "Arachnarok Spider": "Pająk Arachnarok",
  "Giant Cave Squig": "Gigantyczny Jaskiniowy Squig",
  "Doom Wolf": "Wilk Zagłady",
  "Nightmare": "Koszmar",
  "Abyssal Terror": "Otchłanny Potwór",
  "Greyback": "Szarobrzuch",
  "Stonehorn": "Kamienioróg",
  "Thundertusk": "Gromogur",
  "Carnosaur": "Karnozaur",
  "Ripperdactyl": "Ripperdaktyl",
  "Terradon": "Terradon",
  "Stegadon": "Stegadon",
  "Ancient Stegadon": "Pradawny Stegadon",
  "Barded Pegasus": "Opancerzony Pegaz",
  "Royal Pegasus": "Królewski Pegaz",
  "Dark Pegasus": "Mroczny Pegaz",
  "Hippogryph": "Hippogryf",
  "Griffon {empire}": "Gryf {imperium}",
  "Griffon {high elves}": "Gryf {wysokie elfy}",
  "Imperial Griffon": "Imperialny Gryf",
  "Great Eagle {mount}": "Wielki Orzeł {wierzchowiec}",
  "Demigryph": "Demigryf",
  "Unicorn": "Jednorożec",
  "Great Taurus": "Wielki Taurus",
  "Great Taurus {renegade}": "Wielki Taurus {renegaci}",
  "Bale Taurus": "Nieszczęsny Taurus",
  "Ba'hal": "Ba'hal",
  "Lammasu": "Lammasu",
  "Manticore {dark elves}": "Mantikora {mroczne elfy}",
  "Manticore {renegade}": "Mantikora {renegaci}",
  "Manticore {warriors of chaos}": "Mantikora {wojownicy chaosu}",
  "Wyvern": "Wywerna",
  "Black Dragon": "Czarny Smok",
  "Moon Dragon": "Księżycowy Smok",
  "Star Dragon": "Gwiezdny Smok",
  "Sun Dragon": "Słoneczny Smok",
  "Chaos Dragon": "Smok Chaosu",
  "Necrolith Bone Dragon": "Nekrolityczny Kostny Smok",
  "Zombie Dragon": "Zombie Smok",
  "Terrorgheist {mount}": "Terrorgheist {wierzchowiec}",
  "Vargoyle": "Vargulec",
  "Flamespyre Phoenix {mount}": "Feniks Płomienny Stos {wierzchowiec}",
  "Frostheart Phoenix {mount}": "Feniks Mrozowe Serce {wierzchowiec}",
  "Granite Sentinel": "Granitowy Strażnik",
  "Jade Sentinel": "Nefry towy Strażnik",
  "Obsidian Sentinel": "Obsydianowy Strażnik",
  "Terracotta Sentinel": "Terakotowy Strażnik",
  "Warpstone Sentinel": "Strażnik Kamienia Osnowy",
  "Great Spirit Longma": "Wielki Duch Longma",

  // === CHARIOTS ===
  "Chaos Chariot": "Rydwan Chaosu",
  "Chosen Chaos Chariot": "Wybrany Rydwan Chaosu",
  "Gorebeast Chariot": "Rydwan Krwawej Bestii",
  "Razorgor Chariot": "Rydwan Brzytewnoroga",
  "Tuskgor Chariot": "Rydwan Kliszczoroga",
  "Cold One Chariot": "Rydwan Zimnego",
  "Scourgerunner Chariot": "Rydwan Biczbiegacza",
  "Skeleton Chariot": "Szkieletowy Rydwan",
  "Tiranoc Chariot": "Rydwan Tiranoc",
  "Lion Chariot of Chrace": "Lwi Rydwan Chracii",
  "Lothern Skycutter": "Lothernski Tnacz Nieba",
  "Chieftain's Chariot": "Rydwan Wodza",
  "Wolf Chariot": "Wilczy Rydwan",
  "Boar Chariot": "Rydwan Dzika",
  "Black Orc Boar Chariot": "Czarnoorczy Rydwan Dzika",
  "Steam Carriage": "Parowy Powóz",
  "Empire War Wagon": "Imperialny Wagon Bojowy",
  "Sky Lantern": "Latarnia Niebieska",
  "Chariot Runners": "Biegacze Rydwanu",

  // === SPECIAL EQUIPMENT (Extended) ===
  "Ironfist": "Żelazna Pięść",
  "Ironfists": "Żelazne Pięści",
  "Ironfist {renegade}": "Żelazna Pięść {renegaci}",
  "Ironfists {renegade}": "Żelazne Pięści {renegaci}",
  "Look-out Gnoblar": "Gnoblar Obserwator",
  "Look-out Gnoblar (Standard bearer)": "Gnoblar Obserwator (Sztandarowy)",
  "Harpoon launcher (Ogre Beast Rider)": "Wyrzutnia harpunów (Jeździec bestii ogrów)",
  "Pavise": "Pawęż",
  "Sea Dragon Cloak": "Płaszcz Morskiego Smoka",
  "Lion Cloak": "Lwi Płaszcz",
  "Dragonhide Cloak": "Płaszcz ze Smoczej Skóry",
  "Blessed Triptych": "Błogosławiony Tryptyk",
  "Grimfrost weapons": "Broń Mrożnogryzy",
  "Darkforged weapon": "Broń wykuta w mroku",
  "Wolf hammer": "Wilczy młot",
  "Morning Stars": "Gwiazdy poranne",
  "Light cannons": "Lekkie armaty",
  "Steam drill": "Parowy wiertnik",
  "Trollhammer torpedo": "Torpeda Trololmiot",
  "Wards of Grimnir": "Ochrony Grimnira",
  "Oathstone": "Kamień Przysięgi",
  "Goblin-Hewer": "Goblin-ciosacz",
  "Imperial Dwarf Mercenaries": "Imperialni Krasnoludzcy Najemnicy",
  "Imperial Ogres": "Imperialni Ogrzy",
  "Guardians of the Temple": "Strażnicy Świątyni",
  "Defensive Stakes": "Obronne Pale",
  "Sorcerous Exhalation": "Czarnoksięski Wydech",
  "Hellbound": "Piekielnie Związany",
  "Mace tail": "Buławiasty ogon",
  "Venomous tail": "Jadowity ogon",
  "Envenomed sting": "Jadowite żądło",
  "Fiery roar": "Ognisty ryk",
  "Writhing tail": "Wijący ogon",
  "Writhing tails": "Wijące ogony",
  "Lashing talons, Serpentine tail, Briny breath": "Uderzające szpony, Wężowy ogon, Słony oddech",
  "Venomous talons, Venom spray": "Jadowite szpony, Strumień trucizny",
  "Wicked claws": "Złowrogie pazury",
  "Wicked claws, Fiery breath {lizardmen}": "Złowrogie pazury, Ognisty oddech {jaszczuroludzie}",
  "Wicked claws, Fiery breath {renegade}": "Złowrogie pazury, Ognisty oddech {renegaci}",
  "Wicked claws, Fiery breath {dark elves}, Hand weapons, Whips": "Złowrogie pazury, Ognisty oddech {mroczne elfy}, Broń ręczna, Baty",
  "Wicked claws, Serrated maws {renegade}, Fiery breath {dark elves}, Hand weapons, Whips": "Złowrogie pazury, Ząbkowane paszcze {renegaci}, Ognisty oddech {mroczne elfy}, Broń ręczna, Baty",
  "Wicked claws, Razor barbs": "Złowrogie pazury, Ostre kolce",
  "Wicked claws, Distensible jaw": "Złowrogie pazury, Rozciągliwa szczęka",
  "Wicked claws (Warsphinx), Hand weapons (Tomb Guard Crew only), Cavalry spears (Tomb Guard Crew only), Shortbows (Tomb Guard Crew only)": "Złowrogie pazury (Warsphinx), Broń ręczna (tylko Straż Grobowców), Włócznie kawalerii (tylko Straż Grobowców), Krótkie łuki (tylko Straż Grobowców)",
  "Lashing tails and venomous fangs (Hand weapons)": "Uderzające ogony i jadowite kły (Broń ręczna)",
  "Spectral scythe {black coach}, Iron-shod hooves (Hand weapons)": "Widmowa kosa {czarny powóz}, Żelazne kopyta (Broń ręczna)",
  "Spectral scythe {cairn wraith}": "Widmowa kosa {cairn wraith}",
  "Warpstone claws": "Pazury z kamienia osnowy",
  "Talons of the Storm, Dragon fire (Dragon Form)": "Szpony Burzy, Smok ogień (Smocza Forma)",

  // === SPECIAL CHARACTERS & UNIQUE ITEMS ===
  "The Daemon": "Demon",
  "The Mutant": "Mutant",
  "The Revenant": "Widmo",
  "The Witch": "Wiedźma",
  "Two Heads": "Dwie Głowy",
  "The Blessed Blade of Ptra": "Błogosławione Ostrze Ptra",
  "The Chariot of the Gods": "Rydwan Bogów",
  "The Crown of Nehekhara, The Scarab Brooch of Usirian": "Korona Nehekhar y, Skarabeusz Usirian a",
  "The Flail of Conquered Kings": "Cep Pokonanych Królów",
  "The Terrors Below": "Przerażenia Głębin",
  "Skulls of the Foe": "Czaszki Wroga",
  "Sorrow's End": "Koniec Smutku",
  "The Crusader's Vow (replaces the Knight's Vow)": "Przysięga Krzyżowca (zastępuje Przysięgę Rycerza)",
  "The Dolorous Blade": "Bolesne Ostrze",
  "The Exile's Vow (replaces the Knight's Vow)": "Przysięga Wygnańca (zastępuje Przysięgę Rycerza)",
  "The Grail Vow": "Przysięga Graala",
  "The Questing Vow": "Przysięga Poszukiwacza",
  "Sword of Hoeth": "Miecz Hoetha",
  "Swords of Hoeth": "Miecze Hoetha",
  "Horn of Isha": "Róg Ishy",
  "The Might Of Miragliano": "Potęga Miragliano",
  "The Noble Outlaw": "Szlachetny Banita",
  "The Renegade Knight": "Zbuntowany Rycerz",
  "The Wandering Diestro": "Wędrowny Diestro",
  "Warped Tintinnabulation": "Wypaczone Dzwonienie",

  // === SPECIAL UNITS & ABILITIES ===
  "Gors": "Gory",
  "Ungors": "Ungory",
  "Grail Monk": "Mnich Graala",
  "Grail Reliquae": "Relikwiarz Graala",
  "Giant Slayers": "Zabójcy Gigantów",
  "Assassin": "Assassyn",
  "Nightleader": "Przywódca Nocy",
  "Plague Deacon": "Diakon Zarazy",
  "Plague Furnace {renegade}": "Piec Zarazy {renegaci}",
  "Screaming Bell {renegade}": "Dzwon Wrzasku {renegaci}",
  "Coven Throne": "Tron Kowa nu",
  "Mortis Engine": "Silnik Mortis",
  "Cauldron of Blood {renegade}": "Kocioł Krwi {renegaci}",
  "War Altar of Sigmar": "Ołtarz Wojenny Sigmara",
  "Khemrian Warsphinx": "Khemriański Warsphinx",
  "Celestial Dragon Guard": "Straż Niebiańskiego Smoka",
  "Royal Host Archers": "Łucznicy Królewskiego Wojska",
  "Royal Host Horse Archers": "Jeźdźcy Łucznicy Królewskiego Wojska",
  "Royal Host Horsemen": "Jeźdźcy Królewskiego Wojska",
  "Royal Host Warriors": "Wojownicy Królewskiego Wojska",
  "Hand weapons, Doom-flayer": "Broń ręczna, Rozpruwacz",
  "Hand weapons, Warp Grinder": "Broń ręczna, Szlifierka Osnowy",
  "Hand weapons, Warpfire Thrower": "Broń ręczna, Miotacz Warpogiena",
  "Hand weapons, Ratling Gun": "Broń ręczna, Działo Szczurze",
  "Hand weapons, Poisoned Wind Mortar": "Broń ręczna, Moździerz Zatrutes go Wiatru",
  "Hand weapons, Poisoned Wind globes": "Broń ręczna, Kule Zatrutego Wiatru",
  "Hand weapons, Warplock jezzails {skaven}": "Broń ręczna, Jezaile warpowe {skaveni}",
  "Spidersilk lobber": "Miotacz pająkowych sieci",
  "Ravager harpoon*, Hand weapons, Cavalry spears, Repeater crossbows": "Harr pun niszczycielski*, Broń ręczna, Włócznie kawalerii, Powtarzalne kusze",

  // === SPECIAL ATTRIBUTES ===
  "Level 4 Wizard (Human Form), Level 2 Wizard (Dragon Form)": "Czarodziej poziomu 4 (Ludzka Forma), Czarodziej poziomu 2 (Smocza Forma)",
  "Lore of Yang": "Wiedza Yang",
  "Lore of Yin": "Wiedza Yin",
  "Veteran, Vanguard": "Weteran, Awangarda",
  "+1 to Weapon Skill": "+1 do Umiejętności Walki",

  // === KNIGHTLY ORDERS ===
  "Order of the Blazing Sun": "Zakon Płonącego Słońca",
  "Order of the Fiery Heart": "Zakon Ognistego Serca",
  "Order of the Knights Panther": "Zakon Rycerzy Pantery",
  "Order of the Knights of Morr": "Zakon Rycerzy Morra",
  "Order of the White Wolf": "Zakon Białego Wilka",

  // === SERGEANT VARIANTS ===
  "Sergeant (champion), Brace of pistols": "Sierżant (czempion), Para pistoletów",
  "Sergeant (champion), Handgun": "Sierżant (czempion), Arkebuz",
  "Sergeant (champion), Hochland long rifle": "Sierżant (czempion), Długi karabin hochlandzki",
  "Sergeant (champion), Repeater handgun": "Sierżant (czempion), Powtarzalny arkebuz",

  // === BEASTMEN MUTATIONS ===
  "Chaos Mutations": "Mutacje Chaosu",
  "Chaos Mutations (Bloodkine)": "Mutacje Chaosu (Krewniak Krwi)",
  "Chaos Mutations (for Shartak)": "Mutacje Chaosu (dla Shartaka)",

  // === DEMOLITION & SPECIAL WEAPONS (Chaos Dwarfs) ===
  "Demolition Rockets, Infernal Incendiaries, Hand weapons": "Rakiety burzące, Infernalne podpałki, Broń ręczna",

  // === FINAL MISSING EQUIPMENT (8 items) ===
  "Cavalry spears": "Włócznie kawalerii",
  "Great weapon for Captain only": "Wielka broń tylko dla Kapitana",
  "Hand weapons, Cavalry spears, Warbows": "Broń ręczna, Włócznie kawalerii, Łuki bojowe",
  "Hand weapons, Lances, Hand weapons (Hooves)": "Broń ręczna, Lance, Broń ręczna (Kopyta)",
  "Hand weapons, Shields, Cavalry spears": "Broń ręczna, Tarcze, Włócznie kawalerii",
  "Hand weapons, Throwing spears, Shields": "Broń ręczna, Włócznie do rzucania, Tarcze",
  "Hand weapons, Troll vomit": "Broń ręczna, Wymiociny trolla",
  "Shortbow (replaces Throwing weapons)": "Krótki łuk (zastępuje Broń do rzucania)",
};

function addEquipmentTranslations(filePath, translations) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let modifiedCount = 0;
  const modifiedByCategory = {};

  function processUnit(unit, category) {
    let categoryCount = 0;

    // Process equipment array
    if (unit.equipment && Array.isArray(unit.equipment)) {
      unit.equipment.forEach(item => {
        if (item.name_en && !item.name_pl && translations[item.name_en]) {
          item.name_pl = translations[item.name_en];
          categoryCount++;
          console.log(`  ✓ [${category.toUpperCase().padEnd(10)}] ${item.name_en}`);
          console.log(`    → ${item.name_pl}`);
        }
      });
    }

    // Process options array
    if (unit.options && Array.isArray(unit.options)) {
      unit.options.forEach(option => {
        if (option.name_en && !option.name_pl && translations[option.name_en]) {
          option.name_pl = translations[option.name_en];
          categoryCount++;
          console.log(`  ✓ [${category.toUpperCase().padEnd(10)}] ${option.name_en}`);
          console.log(`    → ${option.name_pl}`);
        }

        // Process nested options
        if (option.options && Array.isArray(option.options)) {
          option.options.forEach(nestedOption => {
            if (nestedOption.name_en && !nestedOption.name_pl && translations[nestedOption.name_en]) {
              nestedOption.name_pl = translations[nestedOption.name_en];
              categoryCount++;
              console.log(`  ✓ [${category.toUpperCase().padEnd(10)}] ${nestedOption.name_en}`);
              console.log(`    → ${nestedOption.name_pl}`);
            }
          });
        }
      });
    }

    return categoryCount;
  }

  // Process all unit categories
  ['characters', 'core', 'special', 'rare'].forEach(category => {
    if (data[category] && Array.isArray(data[category])) {
      data[category].forEach(unit => {
        const count = processUnit(unit, category);
        if (count > 0) {
          modifiedByCategory[category] = (modifiedByCategory[category] || 0) + count;
          modifiedCount += count;
        }
      });
    }
  });

  if (modifiedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`\n✓ Modified ${modifiedCount} equipment items in ${path.basename(filePath)}\n`);
    console.log('Summary by category:');
    Object.entries(modifiedByCategory).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} items`);
    });
  } else {
    console.log(`\n  No new translations added (may already exist)\n`);
  }

  return modifiedCount;
}

// Main execution
const unitsDir = path.join(__dirname, '..', 'lib', 'data', 'domain', 'units');
const targetArmy = process.argv[2];

console.log('═'.repeat(60));
console.log('EQUIPMENT TRANSLATION SCRIPT');

if (targetArmy) {
  const targetFile = `${targetArmy}.json`;
  const targetPath = path.join(unitsDir, targetFile);

  if (!fs.existsSync(targetPath)) {
    console.error(`Error: Army file '${targetFile}' not found`);
    process.exit(1);
  }

  console.log(`Processing: ${targetFile}`);
  console.log(`Total translations available: ${Object.keys(EQUIPMENT_TRANSLATIONS).length}`);
  console.log('═'.repeat(60));
  console.log();

  addEquipmentTranslations(targetPath, EQUIPMENT_TRANSLATIONS);
} else {
  const files = fs.readdirSync(unitsDir).filter(f => f.endsWith('.json'));
  console.log(`Processing ${files.length} army file(s)`);
  console.log(`Total translations available: ${Object.keys(EQUIPMENT_TRANSLATIONS).length}`);
  console.log('═'.repeat(60));
  console.log();

  let totalModified = 0;
  const armyStats = [];

  files.forEach(file => {
    console.log('═'.repeat(60));
    console.log(`Processing: ${file}`);
    console.log('═'.repeat(60));

    const filePath = path.join(unitsDir, file);
    const count = addEquipmentTranslations(filePath, EQUIPMENT_TRANSLATIONS);

    if (count > 0) {
      totalModified += count;
      armyStats.push({ army: file, count });
    }
  });

  console.log('═'.repeat(60));
  console.log('FINAL SUMMARY');
  console.log('═'.repeat(60));
  console.log();
  console.log(`Total equipment items translated: ${totalModified}`);
  console.log(`Files processed: ${files.length}`);
  console.log();

  if (armyStats.length > 0) {
    console.log('Breakdown by army:');
    armyStats
      .sort((a, b) => b.count - a.count)
      .forEach(({ army, count }) => {
        console.log(`  ${army.padEnd(40)} ${count} items`);
      });
  }

  console.log();
  console.log('✓ Equipment translation script completed!');
}
