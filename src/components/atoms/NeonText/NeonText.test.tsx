import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NeonText } from './NeonText'

describe('NeonText', () => {
  it('renders children', () => {
    render(<NeonText>SYSTEM READY</NeonText>)
    expect(screen.getByText('SYSTEM READY')).toBeInTheDocument()
  })

  it('renders as span by default', () => {
    const { container } = render(<NeonText>text</NeonText>)
    expect(container.querySelector('span')).not.toBeNull()
  })

  it('renders as the element specified by "as"', () => {
    const { container } = render(<NeonText as="p">text</NeonText>)
    expect(container.querySelector('p')).not.toBeNull()
    expect(container.querySelector('span')).toBeNull()
  })

  it('applies custom color as inline CSS variable', () => {
    const { container } = render(<NeonText color="#ff00cc">text</NeonText>)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.getPropertyValue('--neon-color')).toBe('#ff00cc')
  })

  it('exposes size via data attribute', () => {
    const { container } = render(<NeonText size="lg">text</NeonText>)
    expect(container.firstElementChild).toHaveAttribute('data-size', 'lg')
  })

  it('defaults to md size', () => {
    const { container } = render(<NeonText>text</NeonText>)
    expect(container.firstElementChild).toHaveAttribute('data-size', 'md')
  })
})
