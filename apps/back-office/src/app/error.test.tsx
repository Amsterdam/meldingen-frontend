import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockedErrorPage = vi.fn(({ retry }: { retry: () => void }) => <button onClick={retry}>MockErrorPage</button>)

vi.mock('./_components/ErrorPage/ErrorPage', () => ({
  ErrorPage: (props: { error: Error & { digest?: string }; retry: () => void }) => mockedErrorPage(props),
}))

import AppError from './error'

describe('Error', () => {
  const error = new Error('Something went wrong')

  beforeEach(() => {
    mockedErrorPage.mockClear()
  })

  it('renders the error page and sets the document title', () => {
    render(<AppError error={error} retry={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'MockErrorPage' })).toBeInTheDocument()
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

  it('passes the retry callback through to ErrorPage', async () => {
    const user = userEvent.setup()
    const retry = vi.fn()

    render(<AppError error={error} retry={retry} />)

    expect(mockedErrorPage).toHaveBeenCalledWith(expect.objectContaining({ error, retry }))

    await user.click(screen.getByRole('button', { name: 'MockErrorPage' }))

    expect(retry).toHaveBeenCalledTimes(1)
  })
})
