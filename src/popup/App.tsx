import { useState, useEffect } from 'react'
import type { AppView, Session, TabEntry } from '@/types'
import { useSessions } from '@/hooks/useSessions'
import { useChromeTabs } from '@/hooks/useChromeTabs'
import { SnapButton } from '@/features/snap/SnapButton/SnapButton'
import { SnapForm } from '@/features/snap/SnapForm/SnapForm'
import { SessionLibrary } from '@/features/sessions/SessionLibrary/SessionLibrary'
import { DetailPanel } from '@/features/sessions/DetailPanel/DetailPanel'
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog/ConfirmDialog'
import { LEDIndicator } from '@/components/atoms/LEDIndicator/LEDIndicator'
import styles from './App.module.css'

/**
 * App shell — manages top-level view routing.
 * Views: library | snap | detail | manual
 */
export default function App() {
  const [view, setView] = useState<AppView>('library')
  const [capturedTabs, setCapturedTabs] = useState<TabEntry[]>([])
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [pendingOpenId, setPendingOpenId] = useState<string | null>(null)

  const { sessions, loading, error, addSession, removeSession, patchSession } = useSessions()
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

  // Phase 5: open session — sets pending id, shows confirm dialog
  function handleOpen(id: string) {
    setPendingOpenId(id)
  }

  function handleConfirmOpen() {
    const session = sessions.find(s => s.id === pendingOpenId)
    if (!session) {
      setPendingOpenId(null)
      return
    }
    session.tabs.forEach((tab, i) => {
      void chrome.tabs.create({ url: tab.url, active: i === 0 })
    })
    setPendingOpenId(null)
  }

  function handleCancelOpen() {
    setPendingOpenId(null)
  }

  function handleInspect(id: string) {
    setSelectedSessionId(id)
    setView('detail')
  }

  function handleBack() {
    setView('library')
    setSelectedSessionId(null)
  }

  function handleDeleteFromDetail(id: string) {
    void removeSession(id)
    setView('library')
    setSelectedSessionId(null)
  }

  function handleDelete(id: string) {
    void removeSession(id)
  }

  // Phase 4: remove a single tab from a session
  function handleRemoveTab(sessionId: string, tab: TabEntry) {
    const session = sessions.find(s => s.id === sessionId)
    if (!session) return
    void patchSession(sessionId, { tabs: session.tabs.filter(t => t !== tab) })
  }

  // Guard: if selectedSessionId no longer exists in sessions, navigate back
  useEffect(() => {
    if (view === 'detail' && !loading) {
      const found = sessions.find(s => s.id === selectedSessionId)
      if (!found) {
        setView('library')
        setSelectedSessionId(null)
      }
    }
  }, [view, loading, sessions, selectedSessionId])

  const pendingSession = pendingOpenId !== null
    ? (sessions.find(s => s.id === pendingOpenId) ?? null)
    : null

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.logo}>TAB<span className={styles.logoAccent}>NEXUS</span></span>
        <LEDIndicator label="System online" pulse />
      </header>

      <main className={view === 'detail' ? styles.mainDetail : styles.main}>
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

        {view === 'detail' && (() => {
          const selectedSession = sessions.find(s => s.id === selectedSessionId)
          if (!selectedSession) return null
          return (
            <DetailPanel
              session={selectedSession}
              onBack={handleBack}
              onDelete={handleDeleteFromDetail}
              onRemoveTab={handleRemoveTab}
              onPatchSession={patchSession}
            />
          )
        })()}
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

      <ConfirmDialog
        open={pendingSession !== null}
        title="INITIATE SEQUENCE?"
        message={`Opening ${pendingSession?.tabs.length ?? 0} tabs in current window.`}
        confirmLabel="EXECUTE"
        cancelLabel="ABORT"
        onConfirm={handleConfirmOpen}
        onCancel={handleCancelOpen}
      />
    </div>
  )
}
