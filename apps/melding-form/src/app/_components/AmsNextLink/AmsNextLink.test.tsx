import { render, screen } from '@testing-library/react'

import { AmsNextLink } from './AmsNextLink'

describe('AmsNextLink', () => {
  it('renders a link with the given href', () => {
    render(<AmsNextLink href="#" />)

    const component = screen.getByRole('link')

    expect(component).toHaveAttribute('href', '#')
  })

  it('renders a link with a Menu Link class when variant is menu-link', () => {
    render(<AmsNextLink href="#" variant="menu-link" />)

    const component = screen.getByRole('link')

    expect(component).toHaveClass('ams-menu__link')
  })

  it('renders a link with a Standalone Link class with the extra icon class when variant is standalone-link-with-icon', () => {
    render(<AmsNextLink href="#" variant="standalone-link-with-icon" />)

    const component = screen.getByRole('link')

    expect(component).toHaveClass('ams-standalone-link ams-standalone-link--with-icon')
  })

  it('renders a link with a Link class when variant is link', () => {
    render(<AmsNextLink href="#" variant="link" />)

    const component = screen.getByRole('link')

    expect(component).toHaveClass('ams-link')
  })

  it('renders a link with a Link class when variant is not provided', () => {
    render(<AmsNextLink href="#" />)

    const component = screen.getByRole('link')

    expect(component).toHaveClass('ams-link')
  })

  it('renders an icon when the icon prop is provided', () => {
    const svg = <svg data-testid="test-icon" />

    render(<AmsNextLink href="#" icon={svg} />)

    const icon = screen.getByTestId('test-icon')
    const iconContainer = icon.closest('span')

    expect(icon).toBeInTheDocument()
    expect(iconContainer).toHaveClass('ams-icon')
  })

  it('renders a menu icon with the menu icon class when variant is menu-link', () => {
    const svg = <svg data-testid="test-icon" />

    render(<AmsNextLink href="#" icon={svg} variant="menu-link" />)

    const icon = screen.getByTestId('test-icon')
    const iconContainer = icon.closest('span')

    expect(iconContainer).toHaveClass('ams-menu__icon')
  })
})
