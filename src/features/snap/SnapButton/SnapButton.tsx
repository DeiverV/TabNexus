import styles from './SnapButton.module.css'

interface SnapButtonProps {
  onSnap: () => void
  capturing?: boolean
}

export function SnapButton({ onSnap, capturing = false }: SnapButtonProps) {
  return (
    <button
      type="button"
      aria-label="Snap session"
      className={styles.button}
      disabled={capturing}
      data-capturing={capturing || undefined}
      onClick={onSnap}
    >
      <span className={styles.ring} aria-hidden="true" />
      <span className={styles.icon} aria-hidden="true">
        {/* Record dot */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="8" />
        </svg>
      </span>
    </button>
  )
}
