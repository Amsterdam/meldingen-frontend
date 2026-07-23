import { render, screen } from '@testing-library/react'

import { InvalidFormAlert } from './InvalidFormAlert'

describe('Invalid Form Alert', () => {
  const testErrors = [
    { key: '#', message: 'Vul een geldige datum in (bijvoorbeeld 6 januari 2030).' },
    { key: '#', message: 'De geldigheidsdatum van uw paspoort moet in de toekomst liggen.' },
  ]

  it('renders', () => {
    render(<InvalidFormAlert errors={testErrors} headingLevel={2} />)

    const heading = screen.getByRole('heading', { level: 2, name: 'Verbeter de fouten voor u verder gaat' })

    expect(heading).toBeInTheDocument()
  })

  it('renders a custom heading', () => {
    render(<InvalidFormAlert errors={testErrors} heading="Test heading" headingLevel={2} />)

    const heading = screen.getByRole('heading', { name: 'Test heading' })

    expect(heading).toBeInTheDocument()
  })

  it('renders an extra class name', () => {
    const { container } = render(<InvalidFormAlert className="extra" errors={testErrors} headingLevel={2} />)

    const alert = container.querySelector(':only-child')

    expect(alert).toHaveClass('extra')
  })

  it('renders a list item and link for every error', () => {
    render(<InvalidFormAlert errors={testErrors} headingLevel={2} />)

    const listItems = screen.getAllByRole('listitem')
    const links = screen.getAllByRole('link')

    expect(listItems.length).toBe(2)
    expect(links.length).toBe(2)
  })

  it('renders a link with the correct name and href for every error', () => {
    render(<InvalidFormAlert errors={testErrors} headingLevel={2} />)

    const link1 = screen.getByRole('link', { name: testErrors[0].message })
    const link2 = screen.getByRole('link', { name: testErrors[1].message })

    expect(link1).toHaveAttribute('href', `#${testErrors[0].key}`)
    expect(link2).toHaveAttribute('href', `#${testErrors[1].key}`)
  })

  it('renders the correct heading level', () => {
    render(<InvalidFormAlert errors={testErrors} headingLevel={4} />)

    const heading = screen.getByRole('heading', { level: 4 })

    expect(heading).toBeInTheDocument()
  })

  it('sets focus on Alert on render', () => {
    const { container } = render(<InvalidFormAlert errors={testErrors} headingLevel={2} />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveFocus()
  })

  it('renders nothing when there are no errors', () => {
    const { container } = render(<InvalidFormAlert errors={[]} headingLevel={2} />)

    expect(container).toBeEmptyDOMElement()
  })
})
