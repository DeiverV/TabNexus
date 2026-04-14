import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GlassPanel } from './GlassPanel'

describe('GlassPanel', () => {
  it('renders children', () => {
    render(<GlassPanel>inner content</GlassPanel>)
    expect(screen.getByText('inner content')).toBeInTheDocument()
  })

  it('exposes texture via data attribute', () => {
    const { container } = render(<GlassPanel texture="carbon-fiber">content</GlassPanel>)
    expect(container.firstElementChild).toHaveAttribute('data-texture', 'carbon-fiber')
  })

  it('defaults to default texture', () => {
    const { container } = render(<GlassPanel>content</GlassPanel>)
    expect(container.firstElementChild).toHaveAttribute('data-texture', 'default')
  })

  it('forwards className', () => {
    const { container } = render(<GlassPanel className="custom">content</GlassPanel>)
    expect(container.firstElementChild).toHaveClass('custom')
  })

  it('renders as a section element', () => {
    const { container } = render(<GlassPanel>content</GlassPanel>)
    expect(container.querySelector('section')).not.toBeNull()
  })
})
