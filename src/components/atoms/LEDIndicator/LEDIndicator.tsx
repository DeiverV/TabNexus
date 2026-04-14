import styles from './LEDIndicator.module.css'

type LEDColor = 'green' | 'cyan' | 'magenta' | 'yellow'

interface LEDIndicatorProps {
  label: string
  color?: LEDColor
  pulse?: boolean
}

export function LEDIndicator({ label, color = 'green', pulse = false }: LEDIndicatorProps) {
  return (
    <span
      role="status"
      aria-label={label}
      data-color={color}
      data-pulse={pulse || undefined}
      className={styles.led}
    />
  )
}
