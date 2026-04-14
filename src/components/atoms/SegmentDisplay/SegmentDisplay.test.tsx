import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SegmentDisplay } from './SegmentDisplay'

describe('SegmentDisplay', () => {
  it('renders the value', () => {
    render(<SegmentDisplay value={5} />)
    expect(screen.getByText('05')).toBeInTheDocument()
  })

  it('pads with leading zeros up to digits', () => {
    render(<SegmentDisplay value={3} digits={3} />)
    expect(screen.getByText('003')).toBeInTheDocument()
  })

  it('renders two digits by default', () => {
    render(<SegmentDisplay value={42} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('clamps to max representable value for given digits', () => {
    render(<SegmentDisplay value={150} digits={2} />)
    expect(screen.getByText('99')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<SegmentDisplay value={7} label="TABS" />)
    expect(screen.getByText('TABS')).toBeInTheDocument()
  })

  it('does not render label text when label is omitted', () => {
    render(<SegmentDisplay value={7} />)
    // The wrapper group always renders; the label span should not
    expect(screen.getByRole('group').querySelectorAll('span')).toHaveLength(1)
  })

  it('renders zero as padded zeros', () => {
    render(<SegmentDisplay value={0} />)
    expect(screen.getByText('00')).toBeInTheDocument()
  })
})
