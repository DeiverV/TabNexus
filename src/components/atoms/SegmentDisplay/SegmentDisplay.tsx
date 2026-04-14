import styles from './SegmentDisplay.module.css'

interface SegmentDisplayProps {
  value: number
  digits?: number
  label?: string
}

export function SegmentDisplay({ value, digits = 2, label }: SegmentDisplayProps) {
  const maxValue = Math.pow(10, digits) - 1
  const clamped = Math.min(Math.max(0, Math.floor(value)), maxValue)
  const formatted = String(clamped).padStart(digits, '0')

  return (
    <div role="group" className={styles.wrapper} aria-label={label}>
      <span className={styles.display}>{formatted}</span>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  )
}
