import { render, screen } from '@testing-library/react'

import { MapLoadingIndicator } from './MapLoadingIndicator'

describe('MapLoadingIndicator', () => {
  it('should render', () => {
    render(<MapLoadingIndicator />)

    const heading = screen.getByRole('heading', { name: 'no-js.heading' })

    expect(heading).toBeInTheDocument()
  })
})
