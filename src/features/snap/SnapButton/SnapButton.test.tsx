import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SnapButton } from './SnapButton'

describe('SnapButton', () => {
  // REQ-01
  it('renders with aria-label "Snap session"', () => {
    render(<SnapButton onSnap={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Snap session' })).toBeInTheDocument()
  })

  // REQ-02
  it('calls onSnap when clicked', async () => {
    const user = userEvent.setup()
    const onSnap = vi.fn()
    render(<SnapButton onSnap={onSnap} />)
    await user.click(screen.getByRole('button', { name: 'Snap session' }))
    expect(onSnap).toHaveBeenCalledOnce()
  })

  // REQ-03, REQ-04
  it('is disabled and sets data-capturing when capturing is true', () => {
    render(<SnapButton onSnap={vi.fn()} capturing />)
    const btn = screen.getByRole('button', { name: 'Snap session' })
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('data-capturing', 'true')
  })

  it('does not set data-capturing when capturing is false', () => {
    render(<SnapButton onSnap={vi.fn()} capturing={false} />)
    expect(screen.getByRole('button')).not.toHaveAttribute('data-capturing', 'true')
  })

  it('does not call onSnap when disabled via capturing', async () => {
    const user = userEvent.setup()
    const onSnap = vi.fn()
    render(<SnapButton onSnap={onSnap} capturing />)
    await user.click(screen.getByRole('button'))
    expect(onSnap).not.toHaveBeenCalled()
  })
})
