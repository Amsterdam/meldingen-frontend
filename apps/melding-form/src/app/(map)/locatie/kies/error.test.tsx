import { render, screen } from '@testing-library/react'
import React from 'react'

import Page from './error'

describe('Error component', () => {
  const error = new Error('Test error')

  it('renders the error title', () => {
    render(<Page error={error} />)

    const title = screen.getByRole('heading', { level: 1, name: 'Er is iets mis gegaan' })

    expect(title).toBeInTheDocument()
  })

  it('renders the error paragraph', () => {
    render(<Page error={error} />)

    const firstParagraph = screen.queryAllByRole('paragraph')[0]

    expect(firstParagraph).toHaveTextContent('De pagina die u probeert te bezoeken heeft een storing.')
  })

  it('logs the error to the console', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<Page error={error} />)

    expect(consoleSpy).toHaveBeenCalledWith(error)

    consoleSpy.mockRestore()
  })
})
