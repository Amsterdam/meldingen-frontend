import { render, screen } from '@testing-library/react'

import { FormHeader } from './FormHeader'

describe('FormHeader', () => {
  it('renders', () => {
    render(<FormHeader step="Step 1" title="Test Title" />)

    const header = screen.getByRole('banner', { name: 'Test Title' })

    expect(header).toBeInTheDocument()
  })

  it('renders the step in a paragraph', () => {
    render(<FormHeader step="Step 1" title="Test Title" />)

    const paragraph = screen.getByText('Step 1')

    expect(paragraph).toBeInTheDocument()
  })
})
