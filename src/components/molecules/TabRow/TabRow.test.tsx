import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TabRow } from './TabRow'
import type { TabEntry } from '@/types'

const tabWithFavicon: TabEntry = {
  title: 'GitHub',
  url: 'https://github.com/orgs/tabnexus',
  favIcon: 'https://github.com/favicon.ico',
}

const tabNoFavicon: TabEntry = {
  title: 'No Icon Tab',
  url: 'https://example.com/some/path',
}

const tabEmptyFavicon: TabEntry = {
  title: 'Empty Icon Tab',
  url: 'https://example.com',
  favIcon: '',
}

describe('TabRow', () => {
  // REQ-11
  it('renders the tab title', () => {
    render(<TabRow tab={tabWithFavicon} onRemove={vi.fn()} />)
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })

  // REQ-11
  it('renders the hostname extracted from the URL', () => {
    render(<TabRow tab={tabWithFavicon} onRemove={vi.fn()} />)
    expect(screen.getByText('github.com')).toBeInTheDocument()
  })

  // REQ-11
  it('does not render the full URL path', () => {
    render(<TabRow tab={tabWithFavicon} onRemove={vi.fn()} />)
    expect(screen.queryByText('/orgs/tabnexus')).not.toBeInTheDocument()
    expect(screen.queryByText('https://github.com/orgs/tabnexus')).not.toBeInTheDocument()
  })

  // REQ-12
  it('renders a favicon img when favIcon is a non-empty string', () => {
    render(<TabRow tab={tabWithFavicon} onRemove={vi.fn()} />)
    const img = screen.getByTestId('favicon-img')
    expect(img).toHaveAttribute('src', 'https://github.com/favicon.ico')
    expect(screen.queryByTestId('favicon-fallback')).not.toBeInTheDocument()
  })

  // REQ-13 — favIcon undefined
  it('renders the fallback icon when favIcon is undefined', () => {
    render(<TabRow tab={tabNoFavicon} onRemove={vi.fn()} />)
    expect(screen.getByTestId('favicon-fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('favicon-img')).not.toBeInTheDocument()
  })

  // REQ-13 — favIcon empty string
  it('renders the fallback icon when favIcon is an empty string', () => {
    render(<TabRow tab={tabEmptyFavicon} onRemove={vi.fn()} />)
    expect(screen.getByTestId('favicon-fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('favicon-img')).not.toBeInTheDocument()
  })

  // REQ-13 — broken img URL
  it('renders the fallback icon when the img fails to load', () => {
    const tabBrokenFavicon: TabEntry = {
      title: 'Broken',
      url: 'https://example.com',
      favIcon: 'https://example.com/broken.ico',
    }
    render(<TabRow tab={tabBrokenFavicon} onRemove={vi.fn()} />)
    const img = screen.getByTestId('favicon-img')
    fireEvent.error(img)
    expect(screen.getByTestId('favicon-fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('favicon-img')).not.toBeInTheDocument()
  })

  it('has data-testid="tab-row" on the root element', () => {
    render(<TabRow tab={tabWithFavicon} onRemove={vi.fn()} />)
    expect(screen.getByTestId('tab-row')).toBeInTheDocument()
  })

  it('handles a malformed URL gracefully by rendering the raw string', () => {
    const tabMalformed: TabEntry = { title: 'Bad URL', url: 'not-a-url' }
    render(<TabRow tab={tabMalformed} onRemove={vi.fn()} />)
    expect(screen.getByText('not-a-url')).toBeInTheDocument()
  })

  // --- REQ-01 / SCN-01: delete trigger ---

  it('renders a remove tab button in the DOM (SCN-01)', () => {
    render(<TabRow tab={tabWithFavicon} onRemove={vi.fn()} />)
    expect(screen.getByTestId('remove-tab-btn')).toBeInTheDocument()
  })

  // SCN-02: clicking delete trigger shows inline confirm
  it('shows CONFIRM and CANCEL controls after clicking the remove button (SCN-02)', async () => {
    const user = userEvent.setup()
    render(<TabRow tab={tabWithFavicon} onRemove={vi.fn()} />)
    expect(screen.queryByTestId('inline-confirm')).not.toBeInTheDocument()
    await user.click(screen.getByTestId('remove-tab-btn'))
    expect(screen.getByTestId('inline-confirm')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirm remove tab/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel remove tab/i })).toBeInTheDocument()
  })

  // SCN-02: delete trigger is hidden when confirming
  it('hides the remove button when inline confirm is shown', async () => {
    const user = userEvent.setup()
    render(<TabRow tab={tabWithFavicon} onRemove={vi.fn()} />)
    await user.click(screen.getByTestId('remove-tab-btn'))
    expect(screen.queryByTestId('remove-tab-btn')).not.toBeInTheDocument()
  })

  // SCN-03: CANCEL reverts to default state
  it('reverts to default state when CANCEL is clicked — does not call onRemove (SCN-03)', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<TabRow tab={tabWithFavicon} onRemove={onRemove} />)
    await user.click(screen.getByTestId('remove-tab-btn'))
    await user.click(screen.getByRole('button', { name: /cancel remove tab/i }))
    expect(screen.queryByTestId('inline-confirm')).not.toBeInTheDocument()
    expect(screen.getByTestId('remove-tab-btn')).toBeInTheDocument()
    expect(onRemove).not.toHaveBeenCalled()
  })

  // SCN-04: CONFIRM calls onRemove with the correct TabEntry
  it('calls onRemove with the tab entry when CONFIRM is clicked (SCN-04)', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<TabRow tab={tabWithFavicon} onRemove={onRemove} />)
    await user.click(screen.getByTestId('remove-tab-btn'))
    await user.click(screen.getByRole('button', { name: /confirm remove tab/i }))
    expect(onRemove).toHaveBeenCalledOnce()
    expect(onRemove).toHaveBeenCalledWith(tabWithFavicon)
  })

  // SCN-15: no ConfirmDialog modal on delete trigger click
  it('does not mount a dialog/modal when the remove button is clicked (SCN-15)', async () => {
    const user = userEvent.setup()
    render(<TabRow tab={tabWithFavicon} onRemove={vi.fn()} />)
    await user.click(screen.getByTestId('remove-tab-btn'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
