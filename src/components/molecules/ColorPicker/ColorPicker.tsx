import type { CSSProperties } from 'react'
import styles from './ColorPicker.module.css'

const DEFAULT_PRESETS = ['#00e5ff', '#00ff88', '#ff00cc', '#0088ff', '#ffee00', '#ff6600']

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  presets?: string[]
}

export function ColorPicker({
  value,
  onChange,
  label,
  presets = DEFAULT_PRESETS,
}: ColorPickerProps) {
  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.swatches}>
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={color}
            aria-pressed={value === color}
            className={styles.swatch}
            style={{ '--swatch-color': color } as CSSProperties}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
      <input
        type="text"
        className={styles.hexInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label ? `${label} hex` : 'Custom hex color'}
        spellCheck={false}
        maxLength={7}
      />
    </div>
  )
}
