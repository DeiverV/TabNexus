import type { CSSProperties } from 'react'
import type { Session } from '@/types'
import { SegmentDisplay } from '@/components/atoms/SegmentDisplay/SegmentDisplay'
import styles from './SessionModule.module.css'

interface SessionModuleProps {
  session: Session
  onOpen: (id: string) => void
  onInspect: (id: string) => void
  onDelete: (id: string) => void
}

export function SessionModule({ session, onOpen, onInspect, onDelete }: SessionModuleProps) {
  const style: CSSProperties & Record<string, string> = {
    '--module-glow': session.ui_theme.glowColor,
    '--module-text': session.ui_theme.textColor,
  }

  return (
    <div
      className={styles.module}
      style={style}
      data-texture={session.ui_theme.panelTexture}
    >
      <div className={styles.header}>
        <span className={styles.name}>{session.name}</span>
        <div className={styles.actions}>
          <button
            type="button"
            aria-label={`Inspect ${session.name}`}
            className={styles.iconBtn}
            onClick={() => onInspect(session.id)}
          >
            {/* Eye icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          <button
            type="button"
            aria-label={`Delete ${session.name}`}
            className={[styles.iconBtn, styles.iconBtnDanger].join(' ')}
            onClick={() => onDelete(session.id)}
          >
            {/* Trash icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2"/>
              <path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 6V4h6v2" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>

      <button
        type="button"
        aria-label={`Open session ${session.name}`}
        className={styles.openArea}
        onClick={() => onOpen(session.id)}
      >
        <SegmentDisplay value={session.tabs.length} label="TABS" />
        <span className={styles.hint}>CLICK TO RESTORE</span>
      </button>
    </div>
  )
}
