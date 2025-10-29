# Old World Builder — Warhammer Army Planner

**Author:** Maciek Sala

---

## 1. Introduction

Old World Builder is a web-based application designed to assist Warhammer hobbyists in planning, organizing, and managing their armies. Built with React, Next.js, and Redux Toolkit, the application provides an intuitive interface for selecting units, customizing army lists, and tracking points costs. This Software Design Document (SDD) outlines the architectural and design decisions, component breakdown, data models, and state management approaches employed in the project.

---

## 2. System Overview

The system is a Single Page Application (SPA) that runs in the browser and provides the following core functionalities:

- Browse and select Warhammer units from various factions.
- Customize unit options and upgrades.
- Build and save army lists with point tracking.
- Persist army data locally in the browser.
- Responsive UI for desktop and mobile devices.

**Technology Stack:**

- React 18 with Next.js for server-side rendering and routing.
- Redux Toolkit for global state management.
- TypeScript for type safety.
- LocalStorage for persistence.

---

## 3. Architecture Design

The application follows a modular component-based architecture with separation of concerns between UI, state management, and persistence layers.

```
+-------------------+
|   Next.js Pages   |
| (Routing & SSR)    |
+---------+---------+
          |
+---------v---------+
| React Components  |
|  (UI Layer)       |
+---------+---------+
          |
+---------v---------+
| Redux Toolkit     |
| (State Management)|
+---------+---------+
          |
+---------v---------+
| Persistence Layer |
| (LocalStorage)    |
+-------------------+
```

- **Next.js** handles routing and server-side rendering.
- **React Components** form the interactive UI.
- **Redux Toolkit** manages the global application state.
- **Persistence Layer** abstracts saving and loading data from LocalStorage.

---

## 4. Component Design

### Major Components

- **ArmyBuilderPage**  
  Main page that displays army list, unit selection, and customization panels.

- **UnitList**  
  Displays available units filtered by faction.

- **UnitCard**  
  Shows unit details and options for customization.

- **ArmyList**  
  Displays the current army composition with points and unit summaries.

- **UnitOptionsForm**  
  Form to select upgrades and configurations for a unit.

### Example TypeScript interface for a Unit:

```typescript
export interface Unit {
  id: string;
  name: string;
  faction: string;
  basePoints: number;
  options: UnitOption[];
}

export interface UnitOption {
  id: string;
  name: string;
  pointsCost: number;
  maxAllowed: number;
}
```

---

## 5. Data Design

The data model revolves around units, options, and armies.

```
+----------------+
| Unit           |
|----------------|
| id             |
| name           |
| faction        |
| basePoints     |
| options[]      |
+----------------+

+----------------+
| UnitOption     |
|----------------|
| id             |
| name           |
| pointsCost     |
| maxAllowed     |
+----------------+

+----------------+
| Army           |
|----------------|
| id             |
| name           |
| faction        |
| units[]        |
+----------------+

+----------------+
| ArmyUnit       |
|----------------|
| unitId         |
| selectedOptions[] |
| quantity       |
+----------------+
```

---

## 6. Redux State Management

The Redux store maintains the global state of the army builder, including the current army list, available units, and UI state.

### Redux State Shape

```typescript
interface ArmyState {
  currentArmy: Army;
  availableUnits: Unit[];
  selectedFaction: string;
  ui: {
    isUnitOptionsOpen: boolean;
    selectedUnitId?: string;
  };
}
```

### Example Slice (armySlice.ts)

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ArmyState = {
  currentArmy: { id: "", name: "", faction: "", units: [] },
  availableUnits: [],
  selectedFaction: "",
  ui: { isUnitOptionsOpen: false },
};

const armySlice = createSlice({
  name: "army",
  initialState,
  reducers: {
    setFaction(state, action: PayloadAction<string>) {
      state.selectedFaction = action.payload;
    },
    addUnit(state, action: PayloadAction<ArmyUnit>) {
      state.currentArmy.units.push(action.payload);
    },
    toggleUnitOptions(state, action: PayloadAction<string | undefined>) {
      state.ui.isUnitOptionsOpen = !state.ui.isUnitOptionsOpen;
      state.ui.selectedUnitId = action.payload;
    },
  },
});

export const { setFaction, addUnit, toggleUnitOptions } = armySlice.actions;
export default armySlice.reducer;
```

---

## 7. User Interface Design

The UI is designed to be clean, responsive, and intuitive:

- **Header:** Displays application title and navigation.
- **Faction Selector:** Dropdown or tabs to choose army faction.
- **Unit Browser:** Scrollable list of units with search and filters.
- **Army List Panel:** Shows selected units with points and quantities.
- **Unit Options Modal:** Popup form for customizing unit upgrades.
- **Points Summary:** Displays total points of the current army.

### Example React Component Snippet (UnitCard.tsx)

```tsx
import React from "react";
import { Unit } from "../types";
import { useDispatch } from "react-redux";
import { toggleUnitOptions } from "../redux/armySlice";

interface UnitCardProps {
  unit: Unit;
}

const UnitCard: React.FC<UnitCardProps> = ({ unit }) => {
  const dispatch = useDispatch();

  return (
    <div className="unit-card" onClick={() => dispatch(toggleUnitOptions(unit.id))}>
      <h3>{unit.name}</h3>
      <p>Points: {unit.basePoints}</p>
    </div>
  );
};

export default UnitCard;
```

---

## 8. Persistence and Local Data

Army lists and user preferences are persisted using the browser's LocalStorage API to enable offline usage and data retention between sessions.

- On application load, the store hydrates from LocalStorage.
- On army updates, the state is serialized and saved.
- Persistence logic is encapsulated in a utility module.

### Persistence Flow Diagram

```
+------------------+       +-------------------+       +------------------+
|  Redux Store     | <---> | Persistence Layer | <---> |  LocalStorage     |
+------------------+       +-------------------+       +------------------+
```

---

## 9. Future Enhancements

- **Backend Integration:** Sync army lists with a backend database and user accounts.
- **Battle Simulation:** Add simple battle outcome predictions.
- **Export Options:** PDF and image export of army lists.
- **Community Sharing:** Share armies with other users.
- **Advanced Filtering:** More granular unit filters by traits and abilities.
- **Internationalization:** Support for multiple languages.

---

## 10. Appendix

### Glossary

- **Unit:** A single type of Warhammer model or group.
- **Army:** A collection of units assembled by the user.
- **Points:** Numerical value representing unit cost.
- **Faction:** Warhammer army group (e.g., Empire, Orcs).

### References

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Warhammer Official Rules](https://www.warhammer-community.com/)

---

_End of Software Design Document_
