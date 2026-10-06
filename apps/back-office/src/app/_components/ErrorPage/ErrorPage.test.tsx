import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { ErrorPage } from './ErrorPage'

describe('ErrorPage', () => {
  it('renders the translated heading and shows the retry button', () => {
    render(<ErrorPage retry={vi.fn()} />)

    expect(screen.getByRole('heading', { level: 1, name: 'title' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'retry-button' })).toBeInTheDocument()
  })

  it('calls retry when the retry button is clicked', async () => {
    const user = userEvent.setup()
    const retry = vi.fn()

    render(<ErrorPage retry={retry} />)

    await user.click(screen.getByRole('button', { name: 'retry-button' }))

    expect(retry).toHaveBeenCalledTimes(1)
  })
})
