// ---------------------------------------------------------------------------
// Core domain types — TabNexus
// ---------------------------------------------------------------------------

export type PanelTexture = 'brushed-metal' | 'carbon-fiber' | 'default'

export interface UITheme {
  glowColor: string    // hex — panel glow color
  textColor: string    // hex — neon text color
  panelTexture: PanelTexture
}

export interface TabEntry {
  title: string
  url: string
  favIcon?: string
}

export interface Session {
  id: string           // unique timestamp string
  name: string
  tabs: TabEntry[]
  ui_theme: UITheme
  createdAt: number    // Date.now()
}

// ---------------------------------------------------------------------------
// Storage schema
// ---------------------------------------------------------------------------

export interface StorageData {
  sessions: Session[]
}

// ---------------------------------------------------------------------------
// UI / View states
// ---------------------------------------------------------------------------

export type AppView = 'library' | 'snap' | 'detail' | 'manual'

export interface AppState {
  view: AppView
  selectedSessionId: string | null
}
