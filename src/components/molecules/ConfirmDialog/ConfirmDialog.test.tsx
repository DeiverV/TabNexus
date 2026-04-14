import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('does not render when open is false', () => {
    render(
      <ConfirmDialog open={false} title="Confirm" onConfirm={vi.fn()} onCancel={vi.fn()} />
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders when open is true', () => {
    render(
      <ConfirmDialog open title="INITIATE SEQUENCE?" onConfirm={vi.fn()} onCancel={vi.fn()} />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders the title', () => {
    render(
      <ConfirmDialog open title="INITIATE SEQUENCE?" onConfirm={vi.fn()} onCancel={vi.fn()} />
    )
    expect(screen.getByText('INITIATE SEQUENCE?')).toBeInTheDocument()
  })

  it('renders the message when provided', () => {
    render(
      <ConfirmDialog
        open
        title="DELETE SESSION"
        message="This action cannot be undone."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog open title="Confirm" onConfirm={onConfirm} onCancel={vi.fn()} />
    )
    await user.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(
      <ConfirmDialog open title="Confirm" onConfirm={vi.fn()} onCancel={onCancel} />
    )
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('uses custom button labels when provided', () => {
    render(
      <ConfirmDialog
        open
        title="Confirm"
        confirmLabel="EXECUTE"
        cancelLabel="ABORT"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    expect(screen.getByRole('button', { name: 'EXECUTE' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ABORT' })).toBeInTheDocument()
  })

  it('calls onCancel when the backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(
      <ConfirmDialog open title="Confirm" onConfirm={vi.fn()} onCancel={onCancel} />
    )
    await user.click(screen.getByTestId('dialog-backdrop'))
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
