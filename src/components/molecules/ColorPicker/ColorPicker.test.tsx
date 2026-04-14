import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ColorPicker } from './ColorPicker'

const DEFAULT_PRESETS = ['#00e5ff', '#00ff88', '#ff00cc', '#ffee00']

describe('ColorPicker', () => {
  it('renders the label when provided', () => {
    render(<ColorPicker value="#00e5ff" onChange={vi.fn()} label="Glow Color" />)
    expect(screen.getByText('Glow Color')).toBeInTheDocument()
  })

  it('calls onChange when a preset swatch is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ColorPicker value="#00e5ff" onChange={onChange} presets={DEFAULT_PRESETS} />)
    await user.click(screen.getByRole('button', { name: '#00ff88' }))
    expect(onChange).toHaveBeenCalledWith('#00ff88')
  })

  it('calls onChange when custom hex input changes', () => {
    const onChange = vi.fn()
    render(<ColorPicker value="#00e5ff" onChange={onChange} />)
    const input = screen.getByRole('textbox', { name: /custom hex color/i })
    // Use fireEvent for controlled inputs — bypasses maxLength / DOM state issues
    fireEvent.change(input, { target: { value: '#ff0000' } })
    expect(onChange).toHaveBeenCalledWith('#ff0000')
  })

  it('shows the current value in the text input', () => {
    render(<ColorPicker value="#00e5ff" onChange={vi.fn()} />)
    expect(screen.getByRole('textbox', { name: /custom hex color/i })).toHaveValue('#00e5ff')
  })

  it('marks the active preset as selected', () => {
    render(<ColorPicker value="#00ff88" onChange={vi.fn()} presets={DEFAULT_PRESETS} />)
    expect(screen.getByRole('button', { name: '#00ff88' })).toHaveAttribute('aria-pressed', 'true')
  })
})
