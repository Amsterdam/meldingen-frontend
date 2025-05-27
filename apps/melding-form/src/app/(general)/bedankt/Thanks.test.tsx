import { render, screen } from '@testing-library/react'

import { Thanks } from './Thanks'

describe('Thanks', () => {
  it('should render', () => {
    render(<Thanks publicId="B100AA" date="1-1-1234" time="00:17" />)

    const heading = screen.getByRole('heading', { name: 'title' })
    const paragraph = screen.getByText('description')
    const link = screen.getByRole('link', { name: 'link' })

    expect(heading).toBeInTheDocument()
    expect(paragraph).toBeInTheDocument()
    expect(link).toBeInTheDocument()
  })
})
