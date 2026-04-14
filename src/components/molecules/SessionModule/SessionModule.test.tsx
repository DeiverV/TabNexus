import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SessionModule } from './SessionModule'
import type { Session } from '@/types'

const mockSession: Session = {
  id: '1234',
  name: 'AI Research',
  tabs: [
    { title: 'OpenAI', url: 'https://openai.com' },
    { title: 'Anthropic', url: 'https://anthropic.com' },
    { title: 'HuggingFace', url: 'https://huggingface.co' },
  ],
  ui_theme: { glowColor: '#00e5ff', textColor: '#ffffff', panelTexture: 'default' },
  createdAt: Date.now(),
}

describe('SessionModule', () => {
  it('renders the session name', () => {
    render(<SessionModule session={mockSession} onOpen={vi.fn()} onInspect={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('AI Research')).toBeInTheDocument()
  })

  it('renders the tab count', () => {
    render(<SessionModule session={mockSession} onOpen={vi.fn()} onInspect={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('03')).toBeInTheDocument()
  })

  it('calls onOpen with session id when the module is clicked', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<SessionModule session={mockSession} onOpen={onOpen} onInspect={vi.fn()} onDelete={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /open session/i }))
    expect(onOpen).toHaveBeenCalledWith('1234')
  })

  it('calls onInspect with session id when the inspect button is clicked', async () => {
    const user = userEvent.setup()
    const onInspect = vi.fn()
    render(<SessionModule session={mockSession} onOpen={vi.fn()} onInspect={onInspect} onDelete={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: /inspect/i }))
    expect(onInspect).toHaveBeenCalledWith('1234')
  })

  it('calls onDelete with session id when the delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<SessionModule session={mockSession} onOpen={vi.fn()} onInspect={vi.fn()} onDelete={onDelete} />)
    await user.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledWith('1234')
  })

  it('applies the glow color as a CSS custom property', () => {
    const { container } = render(
      <SessionModule session={mockSession} onOpen={vi.fn()} onInspect={vi.fn()} onDelete={vi.fn()} />
    )
    const el = container.firstElementChild as HTMLElement
    expect(el.style.getPropertyValue('--module-glow')).toBe('#00e5ff')
  })
})
