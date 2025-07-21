import { render, screen } from '@testing-library/react'
import React from 'react'

import Page from './error'

describe('Error component', () => {
  const error = new Error('Test error')

  it('renders the error title', () => {
    render(<Page error={error} />)

    const title = screen.getByRole('heading', { level: 1, name: 'title' })

    expect(title).toBeInTheDocument()
  })

  it('renders the reload button', () => {
    render(<Page error={error} />)

    const button = screen.getByRole('button', { name: 'button' })

    expect(button).toBeInTheDocument()
  })

  it('renders the error paragraph', () => {
    render(<Page error={error} />)

    const firstParagraph = screen.queryAllByRole('paragraph')[0]

    expect(firstParagraph).toHaveTextContent('description')
  })

  it('logs the error to the console', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<Page error={error} />)

    expect(consoleSpy).toHaveBeenCalledWith(error)

    consoleSpy.mockRestore()
  })
})
