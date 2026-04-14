import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LEDIndicator } from './LEDIndicator'

describe('LEDIndicator', () => {
  it('renders with an accessible label', () => {
    render(<LEDIndicator label="System online" />)
    expect(screen.getByRole('status', { name: 'System online' })).toBeInTheDocument()
  })

  it('exposes color via data attribute', () => {
    render(<LEDIndicator label="Active" color="magenta" />)
    expect(screen.getByRole('status')).toHaveAttribute('data-color', 'magenta')
  })

  it('defaults to green color', () => {
    render(<LEDIndicator label="Active" />)
    expect(screen.getByRole('status')).toHaveAttribute('data-color', 'green')
  })

  it('exposes pulse state via data attribute', () => {
    render(<LEDIndicator label="Active" pulse />)
    expect(screen.getByRole('status')).toHaveAttribute('data-pulse', 'true')
  })

  it('does not set pulse data attribute when pulse is false', () => {
    render(<LEDIndicator label="Active" pulse={false} />)
    expect(screen.getByRole('status')).not.toHaveAttribute('data-pulse', 'true')
  })
})
