# TabNexus — Project Instructions

## Project Overview

Chrome extension (Manifest V3) for capturing and restoring tab sessions.
Visual style: Y2K / Frutiger Aero — skeuomorphism, glow effects, sci-fi panels.

## Stack

- **Bundler:** Vite 8 + `vite-plugin-web-extension`
- **UI:** React 19 + TypeScript 6 (strict)
- **Styles:** CSS Modules + CSS Custom Properties (no CSS frameworks)
- **Storage:** `chrome.storage.sync` (abstraction layer in `src/storage/`)
- **Testing:** Vitest 4 + React Testing Library + jest-dom

## Architecture

```
src/
├── background/       # Service Worker (MV3) — no DOM, no React
├── popup/            # Popup entry point (index.html + main.tsx)
├── components/       # Atomic Design
│   ├── atoms/        # Button, Display, LED, SegmentDisplay
│   ├── molecules/    # SessionModule, SnapControl
│   └── organisms/    # SessionLibrary, DetailPanel, ManualCreator
├── features/         # Feature slices (business logic)
│   ├── sessions/     # Session CRUD
│   ├── snap/         # Active tab capture
│   └── manual/       # Manual session creation
├── hooks/            # Custom hooks (useSessions, useSnap, useChromeTabs)
├── storage/          # chrome.storage.sync abstraction
├── types/            # Global types (Session, Tab, UITheme)
└── styles/           # Global CSS variables + design system
    ├── variables.css  # Tokens: colors, shadows, typography
    ├── global.css     # Reset + base styles
    └── animations.css # Keyframes: glow, scan, flicker, led-blink
```

## Key Conventions

### Naming
- Components: PascalCase (`SessionModule.tsx`)
- Hooks: `use` prefix (`useSessions.ts`)
- CSS Modules: `ComponentName.module.css` co-located with the component
- Types: descriptive suffix (`SessionData`, `UITheme`, `TabEntry`)

### Patterns
- **Container / Presentational**: hooks handle logic, components only render
- **Storage layer**: NEVER call `chrome.storage` directly from components — always via `src/storage/`
- **Background ↔ Popup**: communicate via `chrome.runtime.sendMessage` when needed

### CSS / Design System
- All colors and shadows come from `variables.css` (CSS Custom Properties)
- Glow effects: multi-layer `box-shadow` + `text-shadow`
- Fonts: `'Share Tech Mono'` or `'VT323'` for digital displays, `'Orbitron'` for titles
- Never use CSS frameworks (Tailwind, Bootstrap, etc.)

### TypeScript
- Strict mode enabled
- No `any` — use `unknown` with type guards if needed
- Chrome types via `@types/chrome`

## Package Manager

**Always use `pnpm`** — never `npm` or `yarn`.

```bash
pnpm install         # install dependencies
pnpm dev             # watch mode build (outputs dist/ for Chrome to load)
pnpm build           # production build
pnpm type-check      # type-check without emitting
pnpm test            # run tests (watch mode)
pnpm test:run        # run tests once (CI)
pnpm test:coverage   # coverage report
```

To test the extension: load `dist/` as an unpacked extension at `chrome://extensions/`

## Data Model

```typescript
interface Session {
  id: string           // unique timestamp string
  name: string
  tabs: TabEntry[]
  ui_theme: UITheme
  createdAt: number
}

interface TabEntry {
  title: string
  url: string
  favIcon?: string
}

interface UITheme {
  glowColor: string    // hex — panel glow color
  textColor: string    // hex — neon text color
  panelTexture: 'brushed-metal' | 'carbon-fiber' | 'default'
}
```

## Testing (TDD)

### Approach
- Write the test FIRST, watch it fail, then write the implementation.
- Tests live co-located with the component: `ComponentName.test.tsx` next to `ComponentName.tsx`.
- No globals — always import `describe`, `it`, `expect`, `vi` explicitly from `'vitest'`.

### What to test
- **Behavior, not CSS**: never assert on class names — use queries by role, label, or `data-testid`.
- **Rendering**: does it render the right content given props?
- **Interaction**: does it call the right callback with the right args?
- **Conditional rendering**: does it show/hide based on props?
- **Accessibility**: aria attributes, roles, labels on interactive elements.

### What NOT to test
- CSS variable values — jsdom does not compute them.
- Animation keyframes — CSS-only, not testable in jsdom.
- `chrome.*` APIs directly — mock them via `vi.stubGlobal('chrome', ...)` when needed.

### Chrome API mocking
```typescript
// In the test file, before the component that uses chrome.*:
vi.stubGlobal('chrome', {
  storage: {
    sync: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
})
```

### Commands
```bash
npm test              # watch mode
npm run test:run      # single run (CI)
npm run test:coverage # coverage report
```

### File convention
```
src/components/atoms/GlowButton/
├── GlowButton.tsx
├── GlowButton.module.css
└── GlowButton.test.tsx       ← test lives here
```

---

## SDD Workflow

- **Artifact store**: always use `engram` when available — no `openspec` files unless explicitly requested or engram its not working
- **Execution mode**: default to `auto` unless user asks for `interactive`

## What NOT to do

- Do not install UI component libraries (MUI, Chakra, etc.) — the design is fully custom
- Do not use `any` in TypeScript
- Do not call `chrome.storage` directly from React components
- Do not create generic helpers for one-off operations — keep them inline
- Do not animate with JS when CSS can do it
