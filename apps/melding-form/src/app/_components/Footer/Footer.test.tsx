import { render, screen } from '@testing-library/react'

import { Footer } from './Footer'

describe('Footer', () => {
  it('renders', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')

    expect(footer).toBeInTheDocument()
  })

  it('renders the translated heading and footer links with their destinations', () => {
    render(<Footer />)

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()

    const linkDestinations = [
      ['about-meldingen', 'https://www.amsterdam.nl/leefomgeving/een-melding-doen/'],
      ['call', 'tel:phone'],
      ['contact', 'https://www.amsterdam.nl/contact/'],
      ['about', 'https://www.amsterdam.nl/overdezesite/?pk_vid=f2d9fee8ef03552e1791968177bd306b'],
      [
        'privacy',
        'https://www.amsterdam.nl/privacy/specifieke/privacyverklaringen-wonen/meldingen-overlast-privacy/?pk_vid=f2d9fee8ef03552e1791968196bd306b',
      ],
      ['accessibility', 'https://meldingen.amsterdam.nl/toegankelijkheidsverklaring'],
    ]

    for (const [name, destination] of linkDestinations) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', destination)
    }
  })
})
