import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SessionLibrary } from './SessionLibrary'
import type { Session } from '@/types'

const makeSession = (id: string, name: string): Session => ({
  id,
  name,
  tabs: [
    { title: 'Tab One', url: 'https://example.com/1' },
    { title: 'Tab Two', url: 'https://example.com/2' },
  ],
  ui_theme: { glowColor: '#00e5ff', textColor: '#ffffff', panelTexture: 'default' },
  createdAt: 1_700_000_000_000,
})

const session_A = makeSession('id-a', 'Alpha Session')
const session_B = makeSession('id-b', 'Beta Session')
const session_C = makeSession('id-c', 'Gamma Session')

const noop = vi.fn()

describe('SessionLibrary', () => {
  // REQ-08 — data-testid
  it('has data-testid="session-library" on the outermost element', () => {
    render(
      <SessionLibrary sessions={[]} loading={false} error={null}
        onOpen={noop} onInspect={noop} onDelete={noop} />
    )
    expect(screen.getByTestId('session-library')).toBeInTheDocument()
  })

  // REQ-01, REQ-10, REQ-12 — loading state
  it('renders loading indicator when loading=true', () => {
    render(
      <SessionLibrary sessions={[]} loading={true} error={null}
        onOpen={noop} onInspect={noop} onDelete={noop} />
    )
    expect(screen.getByRole('status', { name: /loading sessions/i })).toBeInTheDocument()
    expect(screen.queryByText('NO SESSIONS FOUND')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /open session/i })).not.toBeInTheDocument()
  })

  // REQ-12 — loading hides error
  it('does not render error text when loading=true even if error is set', () => {
    render(
      <SessionLibrary sessions={[]} loading={true} error="Some error"
        onOpen={noop} onInspect={noop} onDelete={noop} />
    )
    expect(screen.queryByText('Some error')).not.toBeInTheDocument()
  })

  // REQ-02, REQ-13 — error state
  it('renders error message when error is non-null and loading=false', () => {
    render(
      <SessionLibrary sessions={[]} loading={false} error="Storage unavailable"
        onOpen={noop} onInspect={noop} onDelete={noop} />
    )
    expect(screen.getByText('Storage unavailable')).toBeInTheDocument()
    expect(screen.queryByText('NO SESSIONS FOUND')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /open session/i })).not.toBeInTheDocument()
  })

  // REQ-03, REQ-09 — empty state
  it('renders "NO SESSIONS FOUND" when sessions=[], loading=false, error=null', () => {
    render(
      <SessionLibrary sessions={[]} loading={false} error={null}
        onOpen={noop} onInspect={noop} onDelete={noop} />
    )
    expect(screen.getByText('NO SESSIONS FOUND')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /open session/i })).not.toBeInTheDocument()
  })

  // REQ-04 — single session
  it('renders exactly one SessionModule when sessions has one entry', () => {
    render(
      <SessionLibrary sessions={[session_A]} loading={false} error={null}
        onOpen={noop} onInspect={noop} onDelete={noop} />
    )
    expect(screen.getAllByRole('button', { name: /open session/i })).toHaveLength(1)
    expect(screen.queryByText('NO SESSIONS FOUND')).not.toBeInTheDocument()
  })

  // REQ-04 — multiple sessions
  it('renders one SessionModule per session when sessions has multiple entries', () => {
    render(
      <SessionLibrary sessions={[session_A, session_B, session_C]} loading={false} error={null}
        onOpen={noop} onInspect={noop} onDelete={noop} />
    )
    expect(screen.getAllByRole('button', { name: /open session/i })).toHaveLength(3)
  })

  // REQ-05 — onOpen forwarding
  it('calls onOpen with session.id when the open area is clicked', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(
      <SessionLibrary sessions={[session_A]} loading={false} error={null}
        onOpen={onOpen} onInspect={noop} onDelete={noop} />
    )
    await user.click(screen.getByRole('button', { name: /open session Alpha Session/i }))
    expect(onOpen).toHaveBeenCalledWith('id-a')
  })

  // REQ-06 — onInspect forwarding
  it('calls onInspect with session.id when the inspect button is clicked', async () => {
    const user = userEvent.setup()
    const onInspect = vi.fn()
    render(
      <SessionLibrary sessions={[session_A]} loading={false} error={null}
        onOpen={noop} onInspect={onInspect} onDelete={noop} />
    )
    await user.click(screen.getByRole('button', { name: /inspect Alpha Session/i }))
    expect(onInspect).toHaveBeenCalledWith('id-a')
  })

  // REQ-07 — onDelete forwarding
  it('calls onDelete with session.id when the delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(
      <SessionLibrary sessions={[session_A]} loading={false} error={null}
        onOpen={noop} onInspect={noop} onDelete={onDelete} />
    )
    await user.click(screen.getByRole('button', { name: /delete Alpha Session/i }))
    expect(onDelete).toHaveBeenCalledWith('id-a')
  })

  // REQ-05 multiple — correct id routing
  it('calls onOpen with the correct id for a specific module in a multi-session list', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(
      <SessionLibrary sessions={[session_A, session_B]} loading={false} error={null}
        onOpen={onOpen} onInspect={noop} onDelete={noop} />
    )
    await user.click(screen.getByRole('button', { name: /open session Beta Session/i }))
    expect(onOpen).toHaveBeenCalledWith('id-b')
    expect(onOpen).not.toHaveBeenCalledWith('id-a')
  })
})
