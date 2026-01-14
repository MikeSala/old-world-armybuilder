# Przewodnik tłumaczeń / Translation Guide

## System tłumaczeń

Projekt używa **hybrydowego systemu tłumaczeń**:

1. **Tłumaczenia strukturalne** (`name_pl` w plikach JSON) - preferowane
2. **Automatyczne tłumaczenia** (regex w `translateEnToPl.ts`) - fallback

## Dodawanie tłumaczeń do jednostek

### Metoda 1: Użycie skryptu (zalecane)

1. Edytuj `scripts/add-pl-translations.js`
2. Dodaj tłumaczenia do obiektu `translations`:

```javascript
const translations = {
  "Dragon Ogres": "Smocze Ogry",
  "Chaos Knights": "Rycerze Chaosu",
  // ... więcej tłumaczeń
};
```

3. Uruchom skrypt:

```bash
node scripts/add-pl-translations.js
```

Skrypt automatycznie doda `name_pl` do pliku `warriors-of-chaos.json`.

### Metoda 2: Ręczna edycja JSON

Otwórz plik jednostek (np. `lib/data/domain/units/warriors-of-chaos.json`) i dodaj pole `name_pl` po `name_en`:

```json
{
  "name_en": "Chaos Knights",
  "name_pl": "Rycerze Chaosu",  // ← dodaj tę linię
  "name_cn": "混沌骑士",
  "name_de": "Chaos Knights",
  // ...
}
```

## Rozszerzanie skryptu na inne armie

Aby dodać tłumaczenia dla innej armii:

1. Edytuj `scripts/add-pl-translations.js`
2. Zmień nazwę pliku:

```javascript
const targetFile = path.join(unitsDir, 'high-elves.json'); // zmień nazwę
```

3. Dodaj tłumaczenia specyficzne dla tej armii
4. Uruchom skrypt

## Priorytet tłumaczeń

System sprawdza tłumaczenia w następującej kolejności:

1. **`name_pl`** w pliku JSON (najwyższy priorytet)
2. **PHRASE_REPLACEMENTS** w `translateEnToPl.ts` (frazy wielowyrazowe)
3. **WORD_MAP** w `translateEnToPl.ts` (pojedyncze słowa)

## Zalecenia

### ✅ Kiedy używać `name_pl`

- Nazwy jednostek (zawsze)
- Złożone frazy wymagające poprawnej gramatyki
- Jednostki z problemami w automatycznym tłumaczeniu

### ✅ Kiedy używać PHRASE_REPLACEMENTS

- Nazwy armii i kompozycji
- Specjalne reguły
- Wspólne frazy występujące w wielu miejscach

### ❌ Czego unikać

- Nie duplikuj tłumaczeń (jeśli jest `name_pl`, usuń z PHRASE_REPLACEMENTS)
- Nie nadpisuj istniejących `name_pl`
- Sprawdź odmianę (np. "Smoczy Ogr" nie "Smok Ogr")

## Testowanie tłumaczeń

Po dodaniu tłumaczeń:

```bash
# 1. Sprawdź typy TypeScript
npm run typecheck

# 2. Zbuduj projekt
npm run build

# 3. Uruchom dev server i sprawdź w przeglądarce
npm run dev
```

Przejdź do edytora rozpiski z językiem polskim i sprawdź czy nazwy wyświetlają się poprawnie.

## Status tłumaczeń

### Warriors of Chaos (Wojownicy Chaosu)
✅ 15/100+ jednostek przetłumaczonych ręcznie
- Wszystkie kluczowe jednostki (postacie, core, special, rare)
- Pozostałe używają automatycznego tłumaczenia

### Inne armie
⏳ Planowane - używają automatycznego tłumaczenia

## Kontrybucja

Chcesz pomóc w tłumaczeniu? Super!

1. Fork repozytorium
2. Dodaj tłumaczenia używając skryptu lub ręcznie
3. Przetestuj lokalnie
4. Stwórz Pull Request z opisem jakie jednostki przetłumaczyłeś

**Naming convention dla commitów:**
```
Add Polish translations for [Army Name] units

Translated units:
- Unit Name 1 → Przetłumaczona Nazwa 1
- Unit Name 2 → Przetłumaczona Nazwa 2
```

## Częste problemy

### Problem: Tłumaczenie się nie wyświetla
- Sprawdź czy `name_pl` jest w poprawnym miejscu (po `name_en`)
- Zrestartuj dev server
- Wyczyść cache przeglądarki

### Problem: Złe tłumaczenie
- Usuń `name_pl` i system użyje automatycznego tłumaczenia
- Lub popraw `name_pl` na lepsze

### Problem: Skrypt nie znajduje pliku
- Upewnij się że jesteś w głównym katalogu projektu
- Sprawdź ścieżkę do pliku w skrypcie

## API

### `getLocalizedName(source, dict)`
Pobiera zlokalizowaną nazwę z obiektu z polami `name_*`.

```typescript
import { getLocalizedName } from '@/lib/i18n/translateLocale';

const unit = {
  name_en: "Chaos Knights",
  name_pl: "Rycerze Chaosu"
};

const polishName = getLocalizedName(unit, { localeName: 'pl' });
// → "Rycerze Chaosu"

const englishName = getLocalizedName(unit, { localeName: 'en' });
// → "Chaos Knights"
```

### `translateNameForDict(value, dict)`
Tłumaczy czysty string (bez dostępu do strukturalnych danych).

```typescript
import { translateNameForDict } from '@/lib/i18n/translateLocale';

translateNameForDict("Dragon Ogre", { localeName: 'pl' });
// → "Smoczy Ogr" (z PHRASE_REPLACEMENTS)
```

---

**Pytania?** Otwórz issue na GitHubie lub kontakt z maintainerami.
