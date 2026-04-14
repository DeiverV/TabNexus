import type { CSSProperties, ElementType, ReactNode } from 'react'
import styles from './NeonText.module.css'

type NeonSize = 'sm' | 'md' | 'lg'

interface NeonTextProps {
  children: ReactNode
  as?: ElementType
  color?: string
  size?: NeonSize
  className?: string
}

export function NeonText({
  children,
  as: Tag = 'span',
  color,
  size = 'md',
  className,
}: NeonTextProps) {
  const style: CSSProperties & Record<string, string> = color
    ? { '--neon-color': color }
    : {}

  return (
    <Tag
      data-size={size}
      style={style}
      className={[styles.text, className].filter(Boolean).join(' ')}
    >
      {children}
    </Tag>
  )
}
