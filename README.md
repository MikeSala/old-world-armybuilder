# Warhammer Army Builder

Warhammer Army Builder is an in-progress roster planner for **Warhammer: The Old World**. The goal is to let players pick an army, configure composition rules, keep track of point limits, and persist drafts so they can iterate on lists over time. The current focus is on the Empire of Man catalogue as a reference implementation.

## Tech Stack

- **Next.js 14 (App Router)** — application shell, routing, and SSR/CSR hybrid behaviour  
- **React 18 + TypeScript** — UI layer with full typing  
- **Redux Toolkit & Redux Persist** — global state, roster drafts, and local persistence  
- **Tailwind CSS** — component styling and layout system  
- **Lucide Icons** — iconography (via `lucide-react`)  
- **pnpm** — package and workspace manager

## Features (Current Milestones)

- Multi-lingual UI scaffolding (PL/EN) with centralized dictionaries
- Roster builder that tracks army selection, compositions, rules, and point limits
- Category buckets showing spending caps per force organization slot with unit picker backed by JSON catalogue data
- Persisted roster draft data between sessions via Redux Persist

## Getting Started

```bash
# install dependencies
pnpm install

# run the development server
pnpm dev

# type-check and lint
pnpm typecheck
pnpm lint
```

The app runs on [http://localhost:3000](http://localhost:3000) in development mode.

## Project Structure

```
app/                # Next.js routes (App Router)
components/         # Reusable UI and builder components
lib/                # Data catalogues, i18n dictionaries, Redux store
```

## Roadmap Highlights

- Expand unit catalogues beyond Empire of Man
- Add equipment/magic item selections and validation rules
- Export/share rosters
- Integrate authentication for remote persistence

---

Built with ❤️ by the Warhammer Army Builder team. Contributions and feedback are welcome!  

