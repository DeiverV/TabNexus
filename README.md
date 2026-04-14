# TabNexus

A Chrome extension (Manifest V3) for capturing and restoring browser tab sessions.
Visual identity: **Y2K / Frutiger Aero** — skeuomorphic panels, neon glow effects, sci-fi aesthetic.

---

## Features

- **Snap** — capture all open tabs in one click and save them as a named session
- **Restore** — reopen any saved session with a single action
- **Custom themes** — per-session glow color, text color, and panel texture
- **Persistent storage** — sessions survive browser restarts via `chrome.storage.sync`

---

## Stack

| Layer | Technology |
|-------|-----------|
| Bundler | Vite 8 + `vite-plugin-web-extension` |
| UI | React 19 + TypeScript 6 (strict) |
| Styles | CSS Modules + CSS Custom Properties |
| Storage | `chrome.storage.sync` (abstraction layer) |
| Testing | Vitest 4 + React Testing Library + jest-dom |
| Package manager | pnpm |

---

## Project Structure

```
src/
├── background/       # Service Worker (MV3) — no DOM, no React
├── popup/            # Popup entry point
├── components/       # Atomic Design
│   ├── atoms/        # GlowButton, LEDIndicator, NeonText, GlassPanel, SegmentDisplay
│   ├── molecules/    # SessionModule, ColorPicker, ConfirmDialog
│   └── organisms/    # SessionLibrary, DetailPanel, ManualCreator
├── features/         # Feature slices
│   ├── sessions/     # Session CRUD
│   └── snap/         # Active tab capture
├── hooks/            # useSessions, useChromeTabs
├── storage/          # chrome.storage.sync abstraction
├── types/            # Session, TabEntry, UITheme
└── styles/           # Design system (variables, global, animations)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev        # watch mode — outputs to dist/
```

Then load the `dist/` folder as an **unpacked extension** at `chrome://extensions/`.

### Build

```bash
pnpm build
```

### Type check

```bash
pnpm type-check
```

### Tests

```bash
pnpm test           # watch mode
pnpm test:run       # single run (CI)
pnpm test:coverage  # coverage report
```

---

## Data Model

```typescript
interface Session {
  id: string
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

---

## Architecture Decisions

- **No CSS frameworks** — the design is fully custom; Tailwind/Bootstrap are explicitly excluded
- **Storage abstraction** — components never call `chrome.storage` directly
- **Container / Presentational pattern** — hooks own all logic, components only render
- **TDD** — tests are written first and live co-located with each component

---

## License

MIT
