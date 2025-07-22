import { render, screen } from '@testing-library/react'

import { FormHeader } from './FormHeader'

describe('FormHeader', () => {
  it('renders', () => {
    render(<FormHeader title="Test Title" step="Step 1" />)

    const header = screen.getByRole('banner', { name: 'Test Title' })

    expect(header).toBeInTheDocument()
  })

  it('renders the step in a paragraph', () => {
    render(<FormHeader title="Test Title" step="Step 1" />)

    const paragraph = screen.getByText('Step 1')

    expect(paragraph).toBeInTheDocument()
  })
})
