import { render, screen } from '@testing-library/react'
import { createRef } from 'react'

import { InvalidFormAlert } from './InvalidFormAlert'

describe('Invalid Form Alert', () => {
  const testErrors = [
    { id: '#', label: 'Vul een geldige datum in (bijvoorbeeld 6 januari 2030).' },
    { id: '#', label: 'De geldigheidsdatum van uw paspoort moet in de toekomst liggen.' },
  ]

  it('renders', () => {
    const { container } = render(<InvalidFormAlert errors={testErrors} headingLevel={2} />)

    const component = container.querySelector(':only-child')

    expect(component).toBeInTheDocument()
    expect(component).toBeVisible()
  })

  it('renders an extra class name', () => {
    const { container } = render(<InvalidFormAlert className="extra" errors={testErrors} headingLevel={2} />)

    const component = container.querySelector(':only-child')

    expect(component).toHaveClass('extra')
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

    const link1 = screen.getByRole('link', { name: testErrors[0].label })
    const link2 = screen.getByRole('link', { name: testErrors[1].label })

    expect(link1).toHaveAttribute('href', testErrors[0].id)
    expect(link2).toHaveAttribute('href', testErrors[1].id)
  })

  it('renders a custom heading', () => {
    render(<InvalidFormAlert errors={testErrors} heading="Test heading" headingLevel={2} />)

    const component = screen.getByRole('heading', { name: 'Test heading' })

    expect(component).toBeInTheDocument()
  })

  it('renders the correct heading level', () => {
    render(<InvalidFormAlert errors={testErrors} headingLevel={4} />)

    const component = screen.getByRole('heading', { level: 4 })

    expect(component).toBeInTheDocument()
  })

  it('supports ForwardRef in React', () => {
    const ref = createRef<HTMLDivElement>()

    const { container } = render(<InvalidFormAlert errors={testErrors} headingLevel={2} ref={ref} />)

    const component = container.querySelector(':only-child')

    expect(ref.current).toBe(component)
  })
})
