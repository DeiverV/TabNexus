import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Session, TabEntry } from '@/types'
import { GlowButton } from '@/components/atoms/GlowButton/GlowButton'
import { SegmentDisplay } from '@/components/atoms/SegmentDisplay/SegmentDisplay'
import { ColorPicker } from '@/components/molecules/ColorPicker/ColorPicker'
import styles from './SnapForm.module.css'

interface SnapFormProps {
  tabs: TabEntry[]
  onSave: (session: Session) => void
  onCancel: () => void
}

export function SnapForm({ tabs, onSave, onCancel }: SnapFormProps) {
  const [name, setName] = useState('')
  const [glowColor, setGlowColor] = useState('#00e5ff')
  const [textColor, setTextColor] = useState('#ffffff')
  const [nameError, setNameError] = useState(false)

  function handleSubmit() {
    if (!name.trim()) {
      setNameError(true)
      return
    }
    const session: Session = {
      id: Date.now().toString(),
      name: name.trim(),
      tabs,
      ui_theme: { glowColor, textColor, panelTexture: 'default' },
      createdAt: Date.now(),
    }
    onSave(session)
  }

  function handleNameChange(value: string) {
    setName(value)
    if (nameError && value.trim()) setNameError(false)
  }

  return (
    <div
      className={styles.backdrop}
      data-testid="snap-form-backdrop"
      onClick={onCancel}
    >
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Snap session"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <span className={styles.badge}>NEW SESSION</span>
          <SegmentDisplay value={tabs.length} label="TABS" />
        </div>

        <div className={styles.field}>
          <label htmlFor="snap-name" className={styles.label}>Session Name</label>
          <input
            id="snap-name"
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter session name..."
            aria-label="Session name"
            autoFocus
          />
          {nameError && (
            <span role="alert" className={styles.error}>Name cannot be empty</span>
          )}
        </div>

        <div className={styles.colors}>
          <ColorPicker
            value={glowColor}
            onChange={setGlowColor}
            label="Glow Color"
          />
          <ColorPicker
            value={textColor}
            onChange={setTextColor}
            label="Text Color"
          />
        </div>

        <div className={styles.preview} style={{ '--preview-glow': glowColor } as CSSProperties}>
          <span className={styles.previewName} style={{ color: textColor }}>{name || 'SESSION NAME'}</span>
        </div>

        <div className={styles.actions}>
          <GlowButton variant="ghost" onClick={onCancel}>CANCEL</GlowButton>
          <GlowButton onClick={handleSubmit}>SAVE SESSION</GlowButton>
        </div>
      </div>
    </div>
  )
}
