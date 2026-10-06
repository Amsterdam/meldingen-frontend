import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AppError from './error'

describe('Error', () => {
  const error = new Error('Something went wrong')

  it('renders the error page and sets the document title', () => {
    render(<AppError error={error} retry={vi.fn()} />)

    expect(screen.getByRole('heading', { level: 1, name: 'title' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'retry-button' })).toBeInTheDocument()
    expect(document.title).toBe('metadata.title')
  })

  it('logs the error on mount', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<AppError error={error} retry={vi.fn()} />)

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
    })

    consoleErrorSpy.mockRestore()
  })

  it('calls retry when the retry button is clicked', async () => {
    const user = userEvent.setup()
    const retry = vi.fn()

    render(<AppError error={error} retry={retry} />)

    await user.click(screen.getByRole('button', { name: 'retry-button' }))

    expect(retry).toHaveBeenCalledTimes(1)
  })
})
