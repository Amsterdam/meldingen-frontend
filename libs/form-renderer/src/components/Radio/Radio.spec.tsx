import { render, screen } from '@testing-library/react'

import { Radio } from './Radio'

const requiredProps = {
  id: 'test-id',
  label: 'Test label',
  validate: { required: true },
  values: [{ label: 'Test value', value: 'test-value', position: 1 }],
}

describe('Radio Component', () => {
  it('renders the Radio component', () => {
    render(<Radio {...requiredProps} />)

    const radio = screen.getByRole('radiogroup', { name: requiredProps.label })

    expect(radio).toBeInTheDocument()
  })

  it('renders a description', () => {
    render(<Radio {...requiredProps} description="Test description" />)

    const radioWithDescription = screen.getByRole('radiogroup', {
      name: requiredProps.label,
      description: 'Test description',
    })

    expect(radioWithDescription).toBeInTheDocument()
  })

  it('renders the Radio items', () => {
    render(<Radio {...requiredProps} />)

    const radioItem = screen.getByRole('radio', { name: requiredProps.values[0].label })

    expect(radioItem).toBeInTheDocument()
  })

  it('correctly marks Radio as required', () => {
    render(<Radio {...requiredProps} />)

    const radio = screen.getByRole('radiogroup', { name: requiredProps.label })

    expect(radio).toBeRequired()
  })

  it('correctly marks Radio as not required', () => {
    render(<Radio {...requiredProps} validate={{ required: false }} />)

    const radio = screen.getByRole('radiogroup', { name: `${requiredProps.label} (niet verplicht)` })

    expect(radio).toBeInTheDocument()
  })

  it('correctly marks Radio item as required', () => {
    render(<Radio {...requiredProps} />)

    const radioItem = screen.getByRole('radio', { name: requiredProps.values[0].label })

    expect(radioItem).toBeRequired()
  })
})
