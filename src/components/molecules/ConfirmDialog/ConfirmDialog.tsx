import { GlowButton } from '@/components/atoms/GlowButton/GlowButton'
import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message?: string
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  cancelLabel?: string
}

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div
      className={styles.backdrop}
      data-testid="dialog-backdrop"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.badge}>SYSTEM PROMPT</div>
        <h2 id="dialog-title" className={styles.title}>{title}</h2>
        {message && <p className={styles.message}>{message}</p>}
        <div className={styles.actions}>
          <GlowButton variant="ghost" onClick={onCancel}>{cancelLabel}</GlowButton>
          <GlowButton onClick={onConfirm}>{confirmLabel}</GlowButton>
        </div>
      </div>
    </div>
  )
}
