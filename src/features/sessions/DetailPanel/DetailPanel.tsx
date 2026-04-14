import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Session, TabEntry } from '@/types'
import { NeonText } from '@/components/atoms/NeonText/NeonText'
import { SegmentDisplay } from '@/components/atoms/SegmentDisplay/SegmentDisplay'
import { GlowButton } from '@/components/atoms/GlowButton/GlowButton'
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog/ConfirmDialog'
import { TabRow } from '@/components/molecules/TabRow/TabRow'
import styles from './DetailPanel.module.css'

interface DetailPanelProps {
  session: Session
  onBack: () => void
  onDelete: (id: string) => void
  onRemoveTab: (sessionId: string, tab: TabEntry) => void
  onPatchSession: (id: string, patch: Partial<Omit<Session, 'id' | 'createdAt'>>) => Promise<void>
}

function formatDate(createdAt: number): string {
  return new Date(createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export function DetailPanel({ session, onBack, onDelete, onRemoveTab, onPatchSession }: DetailPanelProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isRenamingSession, setIsRenamingSession] = useState(false)
  const [renameValue, setRenameValue] = useState('')
  const escaping = useRef(false)

  const style: CSSProperties & Record<string, string> = {
    '--module-glow': session.ui_theme.glowColor,
    '--module-text': session.ui_theme.textColor,
  }

  function startRename() {
    setRenameValue(session.name)
    setIsRenamingSession(true)
  }

  function handleRenameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    } else if (e.key === 'Escape') {
      escaping.current = true
      setIsRenamingSession(false)
    }
  }

  function handleRenameBlur() {
    if (escaping.current) {
      escaping.current = false
      return
    }
    const trimmed = renameValue.trim()
    if (!trimmed) {
      setIsRenamingSession(false)
      return
    }
    if (trimmed !== session.name) {
      void onPatchSession(session.id, { name: trimmed })
    }
    setIsRenamingSession(false)
  }

  return (
    <div
      className={styles.panel}
      style={style}
      data-texture={session.ui_theme.panelTexture}
      data-testid="detail-panel"
    >
      <div className={styles.toolbar}>
        <GlowButton variant="ghost" aria-label="Back" onClick={onBack}>
          ← BACK
        </GlowButton>
        <GlowButton
          variant="danger"
          aria-label="Delete session"
          onClick={() => setConfirmOpen(true)}
        >
          DELETE
        </GlowButton>
      </div>

      <div className={styles.header}>
        <div className={styles.headerRow}>
          {isRenamingSession ? (
            <input
              className={styles.renameInput}
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              onKeyDown={handleRenameKeyDown}
              onBlur={handleRenameBlur}
              aria-label="Session name"
              autoFocus
              data-testid="rename-input"
            />
          ) : (
            <div
              className={styles.sessionNameClickable}
              role="button"
              tabIndex={0}
              onClick={startRename}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') startRename() }}
              aria-label="Click to rename session"
            >
              <NeonText as="h2" size="md" color={session.ui_theme.textColor}>
                {session.name}
              </NeonText>
            </div>
          )}
          <SegmentDisplay value={session.tabs.length} label="TABS" digits={2} />
        </div>
        <span className={styles.createdAt} data-testid="session-created-date">
          {formatDate(session.createdAt)}
        </span>
      </div>

      <div className={styles.restoreBtn}>
        <GlowButton disabled style={{ width: '100%' }}>
          RESTORE ALL
        </GlowButton>
      </div>

      <div className={styles.tabList}>
        <div className={styles.tabListInner}>
          {session.tabs.length === 0 ? (
            <div className={styles.emptyTabs}>NO TABS RECORDED</div>
          ) : (
            session.tabs.map((tab) => (
              <TabRow
                key={tab.url + tab.title}
                tab={tab}
                onRemove={(t) => onRemoveTab(session.id, t)}
              />
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Session?"
        message={`"${session.name}" will be permanently removed.`}
        confirmLabel="DELETE"
        cancelLabel="CANCEL"
        onConfirm={() => {
          onDelete(session.id)
          setConfirmOpen(false)
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
