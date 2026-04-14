import type { ReactNode } from 'react'
import type { PanelTexture } from '@/types'
import styles from './GlassPanel.module.css'

interface GlassPanelProps {
  children: ReactNode
  texture?: PanelTexture
  className?: string
}

export function GlassPanel({ children, texture = 'default', className }: GlassPanelProps) {
  return (
    <section
      data-texture={texture}
      className={[styles.panel, className].filter(Boolean).join(' ')}
    >
      {children}
    </section>
  )
}
