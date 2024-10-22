import { render, screen } from '@testing-library/react'

import { FormRenderer } from './FormRenderer'
import mockFormData from './mocks/mockFormData.json'

describe('FormRenderer', () => {
  it('renders a form', () => {
    const { container } = render(<FormRenderer form={mockFormData} />)

    const form = container.querySelector('form')

    expect(form).toBeInTheDocument()
  })

  it('renders a TextArea', () => {
    render(<FormRenderer form={mockFormData} />)

    const textArea = screen.getByRole('textbox', { name: mockFormData.components[0].components[0].label })

    expect(textArea).toBeInTheDocument()
  })
})
