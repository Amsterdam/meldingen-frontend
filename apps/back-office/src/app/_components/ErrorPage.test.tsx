import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { ErrorPage } from './ErrorPage'

describe('ErrorPage', () => {
  it('renders the error message as the heading and shows the retry button', () => {
    render(<ErrorPage error={new Error('Something went wrong')} retry={vi.fn()} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Something went wrong' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'retry-button' })).toBeInTheDocument()
  })

  it('calls retry when the retry button is clicked', async () => {
    const user = userEvent.setup()
    const retry = vi.fn()

    render(<ErrorPage error={new Error('Something went wrong')} retry={retry} />)

    await user.click(screen.getByRole('button', { name: 'retry-button' }))

    expect(retry).toHaveBeenCalledTimes(1)
  })
})
