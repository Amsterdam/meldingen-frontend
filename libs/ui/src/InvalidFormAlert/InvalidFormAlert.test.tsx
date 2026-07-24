import { render, screen } from '@testing-library/react'

import { InvalidFormAlert } from './InvalidFormAlert'

const defaultProps = {
  errors: [
    { key: '#', message: 'Vul een geldige datum in (bijvoorbeeld 6 januari 2030).' },
    { key: '#', message: 'De geldigheidsdatum van uw paspoort moet in de toekomst liggen.' },
  ],
  headingLevel: 2 as const,
  shouldFocus: false,
}

describe('Invalid Form Alert', () => {
  it('renders', () => {
    render(<InvalidFormAlert {...defaultProps} />)

    const heading = screen.getByRole('heading', { level: 2, name: 'Verbeter de fouten voor u verder gaat' })

    expect(heading).toBeInTheDocument()
  })

  it('renders a custom heading', () => {
    render(<InvalidFormAlert {...defaultProps} heading="Test heading" />)

    const heading = screen.getByRole('heading', { name: 'Test heading' })

    expect(heading).toBeInTheDocument()
  })

  it('renders an extra class name', () => {
    const { container } = render(<InvalidFormAlert {...defaultProps} className="extra" />)

    const alert = container.querySelector(':only-child')

    expect(alert).toHaveClass('extra')
  })

  it('renders a list item and link for every error', () => {
    render(<InvalidFormAlert {...defaultProps} />)

    const listItems = screen.getAllByRole('listitem')
    const links = screen.getAllByRole('link')

    expect(listItems.length).toBe(2)
    expect(links.length).toBe(2)
  })

  it('renders a link with the correct name and href for every error', () => {
    render(<InvalidFormAlert {...defaultProps} />)

    const link1 = screen.getByRole('link', { name: defaultProps.errors[0].message })
    const link2 = screen.getByRole('link', { name: defaultProps.errors[1].message })

    expect(link1).toHaveAttribute('href', `#${defaultProps.errors[0].key}`)
    expect(link2).toHaveAttribute('href', `#${defaultProps.errors[1].key}`)
  })

  it('renders the correct heading level', () => {
    render(<InvalidFormAlert {...defaultProps} headingLevel={4} />)

    const heading = screen.getByRole('heading', { level: 4 })

    expect(heading).toBeInTheDocument()
  })

  it('does not set focus on Alert when shouldFocus is false', () => {
    const { container } = render(<InvalidFormAlert {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).not.toHaveFocus()
  })

  it('sets focus on Alert when shouldFocus is true', () => {
    const { container } = render(<InvalidFormAlert {...defaultProps} shouldFocus />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveFocus()
  })

  it('renders nothing when there are no errors', () => {
    const { container } = render(<InvalidFormAlert {...defaultProps} errors={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
