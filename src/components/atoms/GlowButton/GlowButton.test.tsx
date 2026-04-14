import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GlowButton } from './GlowButton'

describe('GlowButton', () => {
  it('renders its children', () => {
    render(<GlowButton>SNAP</GlowButton>)
    expect(screen.getByRole('button', { name: 'SNAP' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<GlowButton onClick={onClick}>SNAP</GlowButton>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<GlowButton onClick={onClick} disabled>SNAP</GlowButton>)
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('has disabled attribute when disabled prop is true', () => {
    render(<GlowButton disabled>SNAP</GlowButton>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('exposes variant via data attribute', () => {
    render(<GlowButton variant="danger">DELETE</GlowButton>)
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'danger')
  })

  it('defaults to primary variant', () => {
    render(<GlowButton>SNAP</GlowButton>)
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'primary')
  })

  it('renders as submit when type is submit', () => {
    render(<GlowButton type="submit">CONFIRM</GlowButton>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('uses aria-label when provided', () => {
    render(<GlowButton aria-label="Snap session">S</GlowButton>)
    expect(screen.getByRole('button', { name: 'Snap session' })).toBeInTheDocument()
  })
})
