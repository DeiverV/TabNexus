import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SnapForm } from './SnapForm'
import type { TabEntry } from '@/types'

const mockTabs: TabEntry[] = [
  { title: 'OpenAI', url: 'https://openai.com' },
  { title: 'Anthropic', url: 'https://anthropic.com' },
]

describe('SnapForm', () => {
  // REQ-05
  it('renders a text input for session name', () => {
    render(<SnapForm tabs={mockTabs} onSave={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByRole('textbox', { name: /session name/i })).toBeInTheDocument()
  })

  // REQ-07
  it('displays the tab count', () => {
    render(<SnapForm tabs={mockTabs} onSave={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('02')).toBeInTheDocument()
  })

  // REQ-08, REQ-12
  it('calls onSave with a valid Session when submitted with a non-empty name', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<SnapForm tabs={mockTabs} onSave={onSave} onCancel={vi.fn()} />)
    await user.type(screen.getByRole('textbox', { name: /session name/i }), 'My Session')
    await user.click(screen.getByRole('button', { name: /save/i }))
    expect(onSave).toHaveBeenCalledOnce()
    const session = onSave.mock.calls[0][0]
    expect(session.name).toBe('My Session')
    expect(session.tabs).toEqual(mockTabs)
    expect(session.id).toBeDefined()
    expect(session.createdAt).toBeGreaterThan(0)
    expect(session.ui_theme.glowColor).toBeDefined()
    expect(session.ui_theme.textColor).toBeDefined()
  })

  // REQ-09
  it('does not call onSave and shows error when name is empty', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<SnapForm tabs={mockTabs} onSave={onSave} onCancel={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /save/i }))
    expect(onSave).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  // REQ-10
  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<SnapForm tabs={mockTabs} onSave={vi.fn()} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  // REQ-11
  it('calls onCancel when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<SnapForm tabs={mockTabs} onSave={vi.fn()} onCancel={onCancel} />)
    await user.click(screen.getByTestId('snap-form-backdrop'))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  // REQ-06
  it('updates glowColor in the saved session when changed', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<SnapForm tabs={mockTabs} onSave={onSave} onCancel={vi.fn()} />)
    await user.type(screen.getByRole('textbox', { name: /session name/i }), 'Test')
    fireEvent.change(screen.getByRole('textbox', { name: /glow color/i }), {
      target: { value: '#ff00cc' },
    })
    await user.click(screen.getByRole('button', { name: /save/i }))
    expect(onSave.mock.calls[0][0].ui_theme.glowColor).toBe('#ff00cc')
  })
})
