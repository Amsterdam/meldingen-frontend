import { render, screen } from '@testing-library/react'

import { BackOfficeLayout } from './BackOfficeLayout'
import { TOP_ANCHOR_ID } from '~/constants'

describe('BackOfficeLayout', () => {
  it('renders', () => {
    render(<BackOfficeLayout />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Hoofdmenu' })).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<BackOfficeLayout>Test content</BackOfficeLayout>)

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders the header with brand name in logo link', () => {
    render(<BackOfficeLayout />)

    const logoLink = screen.getByRole('link', { name: 'Gemeente Amsterdam logoGa naar de homepage van Meldingen' })
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('renders menu links for overview and melding-form', () => {
    vi.stubEnv('NEXT_PUBLIC_BACK_OFFICE_BASE_URL', 'http://back-office.example.com')

    render(<BackOfficeLayout />)

    const overviewLinks = screen.getAllByRole('link', { name: 'overview' })
    expect(overviewLinks.length).toBe(2)
    expect(overviewLinks[0]).toHaveAttribute('href', 'http://back-office.example.com/')

    const meldingFormLinks = screen.getAllByRole('link', { name: 'melding-form' })
    expect(meldingFormLinks.length).toBe(2)
    expect(meldingFormLinks[0]).toHaveAttribute('href', 'http://back-office.example.com/melden')

    vi.unstubAllEnvs()
  })

  it('sets the top anchor id on the page', () => {
    const { container } = render(<BackOfficeLayout />)

    const page = container.querySelector('.ams-page')

    expect(page).toHaveAttribute('id', TOP_ANCHOR_ID)
  })
})
