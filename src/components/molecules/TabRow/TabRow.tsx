import { useRef, useState } from 'react'
import type { TabEntry } from '@/types'
import styles from './TabRow.module.css'

interface TabRowProps {
  tab: TabEntry
  onRemove: (tab: TabEntry) => void
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function GlobeFallback({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      data-testid="favicon-fallback"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M2 12h20" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function TabRow({ tab, onRemove }: TabRowProps) {
  const [imgError, setImgError] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const showFallback = !tab.favIcon || imgError
  const tabRef = useRef(tab)
  tabRef.current = tab

  return (
    <div className={styles.row} data-testid="tab-row">
      {showFallback ? (
        <GlobeFallback className={styles.faviconFallback} />
      ) : (
        <img
          src={tab.favIcon}
          className={styles.favicon}
          alt=""
          aria-hidden="true"
          data-testid="favicon-img"
          onError={() => setImgError(true)}
        />
      )}
      <div className={styles.info}>
        <span className={styles.title}>{tab.title}</span>
        <span className={styles.url}>{getHostname(tab.url)}</span>
      </div>

      {confirmingDelete ? (
        <div className={styles.inlineConfirm} data-testid="inline-confirm">
          <button
            className={styles.confirmBtn}
            onClick={() => {
              onRemove(tabRef.current)
              setConfirmingDelete(false)
            }}
            aria-label="Confirm remove tab"
          >
            CONFIRM
          </button>
          <button
            className={styles.cancelBtn}
            onClick={() => setConfirmingDelete(false)}
            aria-label="Cancel remove tab"
          >
            CANCEL
          </button>
        </div>
      ) : (
        <button
          className={styles.deleteBtn}
          onClick={() => setConfirmingDelete(true)}
          aria-label="Remove tab"
          data-testid="remove-tab-btn"
        >
          ✕
        </button>
      )}
    </div>
  )
}
