import { render, screen } from '@testing-library/react'

import { MapLoading } from './MapLoading'

describe('MapLoading', () => {
  it('should render', () => {
    render(<MapLoading />)

    const heading = screen.getByRole('heading', { name: 'no-js-alert-title' })

    expect(heading).toBeInTheDocument()
  })
})
