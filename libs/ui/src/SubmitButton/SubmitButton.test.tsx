import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SubmitButton } from './SubmitButton'

const defaultProps = {
  isLoading: false,
  label: 'Test',
  loadingLabel: 'Loading',
}

describe('SubmitButton', () => {
  it('renders a button with type submit', () => {
    render(<SubmitButton {...defaultProps} />)

    const button = screen.getByRole('button', { name: 'Test' })

    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('forwards extra props to the button', () => {
    render(<SubmitButton {...defaultProps} data-test="test" />)

    const button = screen.getByRole('button', { name: 'Test' })

    expect(button).toHaveAttribute('data-test', 'test')
  })

  it('forwards aria-disabled when not loading', () => {
    render(<SubmitButton {...defaultProps} aria-disabled />)

    const button = screen.getByRole('button', { name: 'Test' })

    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  it('calls onClick when clicked and not loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<SubmitButton {...defaultProps} onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: 'Test' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick or submit the form when clicked while loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onSubmit = vi.fn((event) => event.preventDefault())

    render(
      <form onSubmit={onSubmit}>
        <SubmitButton {...defaultProps} isLoading onClick={onClick} />
      </form>,
    )

    await user.click(screen.getByRole('button', { name: 'Test' }))

    expect(onClick).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  describe('loading state', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('does not convey the loading state before the delay has passed', () => {
      render(<SubmitButton {...defaultProps} isLoading />)

      act(() => vi.advanceTimersByTime(499))

      const button = screen.getByRole('button', { name: 'Test' })

      expect(button).not.toHaveAttribute('aria-disabled', 'true')
      expect(button.querySelector('span')).not.toBeInTheDocument()
    })

    it('conveys the loading state after the delay has passed', () => {
      render(<SubmitButton {...defaultProps} isLoading />)

      act(() => vi.advanceTimersByTime(500))

      const button = screen.getByRole('button', { name: 'Test, Loading' })

      expect(button).toHaveAttribute('aria-disabled', 'true')
      expect(button.querySelector('span')).toBeInTheDocument()
    })

    it('stops conveying the loading state when loading finishes', () => {
      const { rerender } = render(<SubmitButton {...defaultProps} isLoading />)

      act(() => vi.advanceTimersByTime(500))

      rerender(<SubmitButton {...defaultProps} isLoading={false} />)

      const button = screen.getByRole('button', { name: 'Test' })

      expect(button).not.toHaveAttribute('aria-disabled', 'true')
      expect(button.querySelector('span')).not.toBeInTheDocument()
    })

    it('restarts the delay when loading starts again', () => {
      const { rerender } = render(<SubmitButton {...defaultProps} isLoading />)

      act(() => vi.advanceTimersByTime(500))

      rerender(<SubmitButton {...defaultProps} isLoading={false} />)
      rerender(<SubmitButton {...defaultProps} isLoading />)

      expect(screen.getByRole('button', { name: 'Test' })).toBeInTheDocument()

      act(() => vi.advanceTimersByTime(500))

      expect(screen.getByRole('button', { name: 'Test, Loading' })).toBeInTheDocument()
    })
  })
})
