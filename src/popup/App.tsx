import { useState } from 'react'
import type { AppView, Session, TabEntry } from '@/types'
import { useSessions } from '@/hooks/useSessions'
import { useChromeTabs } from '@/hooks/useChromeTabs'
import { SnapButton } from '@/features/snap/SnapButton/SnapButton'
import { SnapForm } from '@/features/snap/SnapForm/SnapForm'
import { SessionLibrary } from '@/features/sessions/SessionLibrary/SessionLibrary'
import { LEDIndicator } from '@/components/atoms/LEDIndicator/LEDIndicator'
import styles from './App.module.css'

/**
 * App shell — manages top-level view routing.
 * Views: library | snap | detail | manual
 */
export default function App() {
  const [view, setView] = useState<AppView>('library')
  const [capturedTabs, setCapturedTabs] = useState<TabEntry[]>([])

  const { sessions, loading, error, addSession, removeSession } = useSessions()
  const { captureCurrentWindow, capturing } = useChromeTabs()

  async function handleSnap() {
    const tabs = await captureCurrentWindow()
    if (tabs.length === 0) return
    setCapturedTabs(tabs)
    setView('snap')
  }

  async function handleSave(session: Session) {
    await addSession(session)
    setCapturedTabs([])
    setView('library')
  }

  function handleCancelSnap() {
    setCapturedTabs([])
    setView('library')
  }

  // Phase 3 stubs — wired to real behavior in Phases 4-5
  function handleOpen(_id: string) {
    // TODO Phase 5: open session tabs via chrome.tabs.create
  }

  function handleInspect(_id: string) {
    // TODO Phase 4: setView('detail'), set selectedSessionId
  }

  function handleDelete(id: string) {
    void removeSession(id)
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.logo}>TAB<span className={styles.logoAccent}>NEXUS</span></span>
        <LEDIndicator label="System online" pulse />
      </header>

      <main className={styles.main}>
        {view === 'library' && (
          <SessionLibrary
            sessions={sessions}
            loading={loading}
            error={error}
            onOpen={handleOpen}
            onInspect={handleInspect}
            onDelete={handleDelete}
          />
        )}
      </main>

      {view === 'library' && (
        <footer className={styles.footer}>
          <SnapButton onSnap={() => { void handleSnap() }} capturing={capturing} />
        </footer>
      )}

      {view === 'snap' && (
        <SnapForm
          tabs={capturedTabs}
          onSave={(session) => { void handleSave(session) }}
          onCancel={handleCancelSnap}
        />
      )}
    </div>
  )
}
