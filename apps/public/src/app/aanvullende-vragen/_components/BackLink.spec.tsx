import { fireEvent, render, screen } from '@testing-library/react'

import { NextRouterContextProviderMock } from '../../../mocks/NextRouterContextProviderMock'

import { BackLink } from './BackLink'

describe('Back link', () => {
  it('renders', () => {
    const handleClick = jest.fn()

    render(<BackLink page={0} handleClick={handleClick} />)

    const component = screen.getByRole('link')

    expect(component).toBeInTheDocument()
    expect(component).toBeVisible()
  })

  it('renders a Next link on the first page', () => {
    const handleClick = jest.fn()
    const push = jest.fn()

    render(
      <NextRouterContextProviderMock router={{ push }}>
        <BackLink page={0} handleClick={handleClick} />
      </NextRouterContextProviderMock>,
    )

    const component = screen.getByRole('link')

    fireEvent.click(component)

    expect(push).toHaveBeenCalled()
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders a regular link with a handler on the other pages', () => {
    const handleClick = jest.fn()
    const push = jest.fn()

    render(
      <NextRouterContextProviderMock router={{ push }}>
        <BackLink page={1} handleClick={handleClick} />
      </NextRouterContextProviderMock>,
    )

    const component = screen.getByRole('link')

    fireEvent.click(component)

    expect(push).not.toHaveBeenCalled()
    expect(handleClick).toHaveBeenCalled()
  })
})
