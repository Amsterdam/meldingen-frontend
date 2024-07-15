import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { NextRouterContextProviderMock } from '../../../mocks/NextRouterContextProviderMock'

import { BackLink } from './BackLink'

describe('BackLink', () => {
  it('renders', () => {
    const clickHandler = jest.fn()

    render(<BackLink page={0} handleClick={clickHandler} />)

    const component = screen.getByRole('link')

    expect(component).toBeInTheDocument()
    expect(component).toBeVisible()
  })

  it('renders a Next link on the first page', async () => {
    const user = userEvent.setup()
    const clickHandler = jest.fn()
    const nextRouterPush = jest.fn()

    render(
      <NextRouterContextProviderMock router={{ push: nextRouterPush }}>
        <BackLink page={0} handleClick={clickHandler} />
      </NextRouterContextProviderMock>,
    )

    const component = screen.getByRole('link')

    await user.click(component)

    expect(nextRouterPush).toHaveBeenCalled()
    expect(clickHandler).not.toHaveBeenCalled()
  })

  it('renders a regular link with a handler on the other pages', async () => {
    const user = userEvent.setup()
    const clickHandler = jest.fn()
    const nextRouterPush = jest.fn()

    render(
      <NextRouterContextProviderMock router={{ push: nextRouterPush }}>
        <BackLink page={1} handleClick={clickHandler} />
      </NextRouterContextProviderMock>,
    )

    const component = screen.getByRole('link')

    await user.click(component)

    expect(nextRouterPush).not.toHaveBeenCalled()
    expect(clickHandler).toHaveBeenCalled()
  })
})
