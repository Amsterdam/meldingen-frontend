import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'
import type { Mock } from 'vitest'
import { vi } from 'vitest'

import { Locatie } from './Locatie'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

describe('Locatie', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useActionState as Mock).mockReturnValue([{}, vi.fn()])
  })

  it('renders', () => {
    render(<Locatie prevPage="/previous" />)

    const heading = screen.getByRole('heading', { name: 'Locatie' })

    expect(heading).toBeInTheDocument()
  })

  it('renders the correct backlink', () => {
    render(<Locatie prevPage="/previous" />)

    const backLink = screen.getByRole('link', { name: 'Vorige vraag' })

    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/previous')
  })

  it('does not render an error message when there is none', () => {
    render(<Locatie prevPage="/previous" />)

    const errorMessage = screen.queryByText('Test error message')

    expect(errorMessage).not.toBeInTheDocument()
  })

  it('renders an error message when there is one', () => {
    ;(useActionState as Mock).mockReturnValue([{ message: 'Test error message' }, vi.fn()])

    render(<Locatie prevPage="/previous" />)
    const errorMessage = screen.getByText('Test error message')

    expect(errorMessage).toBeInTheDocument()
  })

  it('renders the default text when there is no location data', () => {
    render(<Locatie prevPage="/previous" />)

    const paragraph = screen.getByText('In het volgende scherm kunt u op de kaart een adres of container opzoeken.')

    expect(paragraph).toBeInTheDocument()
  })

  it('renders the location data name when it is provided', () => {
    render(<Locatie prevPage="/previous" locationData={{ name: 'Test location' }} />)

    const paragraph = screen.getByText('Test location')

    expect(paragraph).toBeInTheDocument()
  })

  it('renders a link with the default text when there is no location data', () => {
    render(<Locatie prevPage="/previous" />)

    const link = screen.getByRole('link', { name: 'Selecteer de locatie' })

    expect(link).toBeInTheDocument()
  })

  it('renders a link with updated text when there is location data', () => {
    render(<Locatie prevPage="/previous" locationData={{ name: 'Test location' }} />)

    const link = screen.getByRole('link', { name: 'Wijzig locatie' })

    expect(link).toBeInTheDocument()
  })
})
