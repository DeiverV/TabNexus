import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DetailPanel } from './DetailPanel'
import type { Session } from '@/types'

const mockSession: Session = {
  id: 'abc-123',
  name: 'Work Sprint',
  tabs: [
    { title: 'GitHub', url: 'https://github.com', favIcon: 'https://github.com/favicon.ico' },
    { title: 'Linear', url: 'https://linear.app', favIcon: '' },
    { title: 'Notion', url: 'https://notion.so' },
  ],
  ui_theme: { glowColor: '#00e5ff', textColor: '#ffffff', panelTexture: 'default' },
  createdAt: new Date('2026-04-13T14:32:00Z').getTime(),
}

const emptySession: Session = {
  id: 'empty-1',
  name: 'Empty Session',
  tabs: [],
  ui_theme: { glowColor: '#ff00cc', textColor: '#ffee00', panelTexture: 'carbon-fiber' },
  createdAt: Date.now(),
}

function renderPanel(overrides?: Partial<Parameters<typeof DetailPanel>[0]>) {
  return render(
    <DetailPanel
      session={mockSession}
      onBack={vi.fn()}
      onDelete={vi.fn()}
      onRemoveTab={vi.fn()}
      onPatchSession={vi.fn().mockResolvedValue(undefined)}
      {...overrides}
    />
  )
}

describe('DetailPanel', () => {
  // REQ-01
  it('renders the session name', () => {
    renderPanel()
    expect(screen.getByText('Work Sprint')).toBeInTheDocument()
  })

  // REQ-02
  it('renders the tab count via SegmentDisplay', () => {
    renderPanel()
    expect(screen.getByText('03')).toBeInTheDocument()
  })

  // REQ-03
  it('renders the formatted creation date', () => {
    renderPanel()
    expect(screen.getByTestId('session-created-date')).toBeInTheDocument()
    expect(screen.getByTestId('session-created-date').textContent).not.toBe('')
  })

  // REQ-04
  it('applies --module-glow CSS custom property from session theme', () => {
    const { container } = renderPanel()
    const panel = container.firstElementChild as HTMLElement
    expect(panel.style.getPropertyValue('--module-glow')).toBe('#00e5ff')
  })

  it('applies --module-text CSS custom property from session theme', () => {
    const { container } = renderPanel()
    const panel = container.firstElementChild as HTMLElement
    expect(panel.style.getPropertyValue('--module-text')).toBe('#ffffff')
  })

  it('sets data-texture attribute from session panelTexture', () => {
    const { container } = render(
      <DetailPanel
        session={emptySession}
        onBack={vi.fn()}
        onDelete={vi.fn()}
        onRemoveTab={vi.fn()}
        onPatchSession={vi.fn().mockResolvedValue(undefined)}
      />
    )
    const panel = container.firstElementChild as HTMLElement
    expect(panel.getAttribute('data-texture')).toBe('carbon-fiber')
  })

  // REQ-05
  it('renders one tab-row per tab in session.tabs', () => {
    renderPanel()
    expect(screen.getAllByTestId('tab-row')).toHaveLength(3)
  })

  // REQ-06
  it('renders a disabled RESTORE ALL button', () => {
    renderPanel()
    const restoreBtn = screen.getByRole('button', { name: /restore all/i })
    expect(restoreBtn).toBeDisabled()
  })

  // REQ-07
  it('calls onBack when the back button is clicked', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    renderPanel({ onBack })
    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  // REQ-08
  it('opens ConfirmDialog when delete button is clicked — does NOT call onDelete directly', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    renderPanel({ onDelete })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /delete session/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(onDelete).not.toHaveBeenCalled()
  })

  // REQ-09
  it('calls onDelete with session.id when ConfirmDialog confirm is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    renderPanel({ onDelete })
    await user.click(screen.getByRole('button', { name: /delete session/i }))
    await user.click(screen.getByRole('button', { name: 'DELETE' }))
    expect(onDelete).toHaveBeenCalledOnce()
    expect(onDelete).toHaveBeenCalledWith('abc-123')
  })

  // REQ-10
  it('closes ConfirmDialog and does NOT call onDelete when cancel is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    renderPanel({ onDelete })
    await user.click(screen.getByRole('button', { name: /delete session/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'CANCEL' }))
    expect(onDelete).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps DetailPanel visible after cancel', async () => {
    const user = userEvent.setup()
    renderPanel()
    await user.click(screen.getByRole('button', { name: /delete session/i }))
    await user.click(screen.getByRole('button', { name: 'CANCEL' }))
    expect(screen.getByTestId('detail-panel')).toBeInTheDocument()
  })

  // Edge case — empty tabs
  it('renders zero tab-rows and shows empty message when session.tabs is empty', () => {
    render(
      <DetailPanel
        session={emptySession}
        onBack={vi.fn()}
        onDelete={vi.fn()}
        onRemoveTab={vi.fn()}
        onPatchSession={vi.fn().mockResolvedValue(undefined)}
      />
    )
    expect(screen.queryAllByTestId('tab-row')).toHaveLength(0)
    expect(screen.getByText('NO TABS RECORDED')).toBeInTheDocument()
  })

  it('renders SegmentDisplay with 00 when session has no tabs', () => {
    render(
      <DetailPanel
        session={emptySession}
        onBack={vi.fn()}
        onDelete={vi.fn()}
        onRemoveTab={vi.fn()}
        onPatchSession={vi.fn().mockResolvedValue(undefined)}
      />
    )
    expect(screen.getByText('00')).toBeInTheDocument()
  })

  // --- Rename session (SCN-07 through SCN-13) ---

  // SCN-07: session name is a clickable element
  it('renders the session name as a clickable element (SCN-07)', () => {
    renderPanel()
    expect(screen.getByRole('button', { name: /click to rename session/i })).toBeInTheDocument()
  })

  // SCN-07: clicking name shows input pre-populated with session name
  it('shows a focused input pre-populated with session name when clicked (SCN-07)', async () => {
    const user = userEvent.setup()
    renderPanel()
    await user.click(screen.getByRole('button', { name: /click to rename session/i }))
    const input = screen.getByTestId('rename-input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('Work Sprint')
  })

  // SCN-07: NeonText h2 is hidden while input is visible
  it('hides the clickable name wrapper while rename input is shown (SCN-07)', async () => {
    const user = userEvent.setup()
    renderPanel()
    await user.click(screen.getByRole('button', { name: /click to rename session/i }))
    expect(screen.queryByRole('button', { name: /click to rename session/i })).not.toBeInTheDocument()
    expect(screen.getByTestId('rename-input')).toBeInTheDocument()
  })

  // SCN-08: Enter with changed valid name calls onPatchSession
  it('calls onPatchSession with new name when Enter is pressed (SCN-08)', async () => {
    const user = userEvent.setup()
    const onPatchSession = vi.fn().mockResolvedValue(undefined)
    renderPanel({ onPatchSession })
    await user.click(screen.getByRole('button', { name: /click to rename session/i }))
    const input = screen.getByTestId('rename-input')
    await user.clear(input)
    await user.type(input, 'New Sprint Name')
    await user.keyboard('{Enter}')
    expect(onPatchSession).toHaveBeenCalledOnce()
    expect(onPatchSession).toHaveBeenCalledWith('abc-123', { name: 'New Sprint Name' })
  })

  // SCN-08: exits edit mode after Enter
  it('exits edit mode and shows updated name after Enter (SCN-08)', async () => {
    const user = userEvent.setup()
    renderPanel()
    await user.click(screen.getByRole('button', { name: /click to rename session/i }))
    const input = screen.getByTestId('rename-input')
    await user.clear(input)
    await user.type(input, 'Renamed')
    await user.keyboard('{Enter}')
    expect(screen.queryByTestId('rename-input')).not.toBeInTheDocument()
  })

  // SCN-09: Enter with empty value does not call onPatchSession, reverts
  it('does not call onPatchSession when Enter is pressed with empty value (SCN-09)', async () => {
    const user = userEvent.setup()
    const onPatchSession = vi.fn().mockResolvedValue(undefined)
    renderPanel({ onPatchSession })
    await user.click(screen.getByRole('button', { name: /click to rename session/i }))
    const input = screen.getByTestId('rename-input')
    await user.clear(input)
    await user.keyboard('{Enter}')
    expect(onPatchSession).not.toHaveBeenCalled()
    expect(screen.queryByTestId('rename-input')).not.toBeInTheDocument()
  })

  // SCN-10: Escape cancels rename without calling onPatchSession
  it('cancels rename and restores name when Escape is pressed (SCN-10)', async () => {
    const user = userEvent.setup()
    const onPatchSession = vi.fn().mockResolvedValue(undefined)
    renderPanel({ onPatchSession })
    await user.click(screen.getByRole('button', { name: /click to rename session/i }))
    const input = screen.getByTestId('rename-input')
    await user.clear(input)
    await user.type(input, 'Changed Name')
    await user.keyboard('{Escape}')
    expect(onPatchSession).not.toHaveBeenCalled()
    expect(screen.queryByTestId('rename-input')).not.toBeInTheDocument()
    expect(screen.getByText('Work Sprint')).toBeInTheDocument()
  })

  // SCN-11: Blur with valid changed name calls onPatchSession
  it('calls onPatchSession when input loses focus with a changed valid name (SCN-11)', async () => {
    const user = userEvent.setup()
    const onPatchSession = vi.fn().mockResolvedValue(undefined)
    renderPanel({ onPatchSession })
    await user.click(screen.getByRole('button', { name: /click to rename session/i }))
    const input = screen.getByTestId('rename-input')
    await user.clear(input)
    await user.type(input, 'Blurred Name')
    await user.tab()
    expect(onPatchSession).toHaveBeenCalledOnce()
    expect(onPatchSession).toHaveBeenCalledWith('abc-123', { name: 'Blurred Name' })
  })

  // SCN-12: Blur with unchanged name does not call onPatchSession
  it('does not call onPatchSession when input loses focus with unchanged name (SCN-12)', async () => {
    const user = userEvent.setup()
    const onPatchSession = vi.fn().mockResolvedValue(undefined)
    renderPanel({ onPatchSession })
    await user.click(screen.getByRole('button', { name: /click to rename session/i }))
    // do not change the value, just tab away
    await user.tab()
    expect(onPatchSession).not.toHaveBeenCalled()
  })

  // --- onRemoveTab wiring ---

  it('passes onRemove to each TabRow (SCN-14)', async () => {
    const user = userEvent.setup()
    const onRemoveTab = vi.fn()
    renderPanel({ onRemoveTab })
    // Click the remove button on the first tab row
    const removeBtns = screen.getAllByTestId('remove-tab-btn')
    await user.click(removeBtns[0])
    await user.click(screen.getByRole('button', { name: /confirm remove tab/i }))
    expect(onRemoveTab).toHaveBeenCalledOnce()
    expect(onRemoveTab).toHaveBeenCalledWith('abc-123', mockSession.tabs[0])
  })
})
