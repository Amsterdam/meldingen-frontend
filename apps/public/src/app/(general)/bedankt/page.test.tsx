import { screen, render } from '@testing-library/react'

import Page from './page'

describe('Page', () => {
  it('should render', () => {
    render(<Page />)

    const heading = screen.getByRole('heading', { name: 'Bedankt' })

    expect(heading).toBeInTheDocument()
  })
})
