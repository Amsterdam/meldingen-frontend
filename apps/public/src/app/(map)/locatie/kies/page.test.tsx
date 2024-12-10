import { render, waitFor } from '@testing-library/react'

import Page from './page'

describe('Page', () => {
  it('should render', async () => {
    const { container } = render(<Page />)

    const outerWrapper = container.querySelector('div')

    waitFor(() => {
      expect(outerWrapper).toBeInTheDocument()
    })
  })
})
