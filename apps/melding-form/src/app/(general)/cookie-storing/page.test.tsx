import { render, screen } from '@testing-library/react'

import Page from './page'

describe('Page', () => {
  it('renders page', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    const heading = screen.getByRole('heading', { name: 'Er is iets mis gegaan' })
    const paragraph = screen.getByText(
      'De pagina die u probeert te bezoeken heeft een storing. De cookies die nodig zijn om het formulier af te maken missen.',
    )
    const link = screen.getByRole('link', { name: 'Probeer de melding opnieuw te maken.' })

    expect(heading).toBeInTheDocument()
    expect(paragraph).toBeInTheDocument()
    expect(link).toBeInTheDocument()
  })
})
