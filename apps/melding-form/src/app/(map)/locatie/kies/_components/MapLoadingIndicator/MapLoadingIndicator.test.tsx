import { render, screen } from '@testing-library/react'

import { MapLoadingIndicator } from './MapLoadingIndicator'

describe('MapLoadingIndicator', () => {
  it('should render', () => {
    render(<MapLoadingIndicator />)

    const heading = screen.getByRole('heading', { name: 'no-js-alert-title' })

    expect(heading).toBeInTheDocument()
  })
})
