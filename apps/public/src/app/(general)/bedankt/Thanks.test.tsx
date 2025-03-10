import { render, screen } from '@testing-library/react'

import { Thanks } from './Thanks'

describe('Thanks', () => {
  it('should render', () => {
    render(<Thanks meldingId="1" />)

    const heading = screen.getByRole('heading', { name: 'title' })
    const paragraph = screen.getByText('description')
    const link = screen.getByRole('link', { name: 'link' })

    expect(heading).toBeInTheDocument()
    expect(paragraph).toBeInTheDocument()
    expect(link).toBeInTheDocument()
  })
})
