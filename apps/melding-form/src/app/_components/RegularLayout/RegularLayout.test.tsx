import { render, screen } from '@testing-library/react'

import { RegularLayout } from './RegularLayout'
import { TOP_ANCHOR_ID } from '~/constants'

describe('RegularLayout', () => {
  it('renders', () => {
    render(<RegularLayout />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<RegularLayout>Test content</RegularLayout>)

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('sets the top anchor id on the page', () => {
    const { container } = render(<RegularLayout />)

    const page = container.querySelector('.ams-page')

    expect(page).toHaveAttribute('id', TOP_ANCHOR_ID)
  })
})
