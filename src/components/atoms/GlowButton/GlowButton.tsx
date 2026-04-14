import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './GlowButton.module.css'

type Variant = 'primary' | 'danger' | 'ghost'

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: Variant
}

export function GlowButton({
  children,
  variant = 'primary',
  type = 'button',
  className,
  ...rest
}: GlowButtonProps) {
  return (
    <button
      type={type}
      data-variant={variant}
      className={[styles.button, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}
