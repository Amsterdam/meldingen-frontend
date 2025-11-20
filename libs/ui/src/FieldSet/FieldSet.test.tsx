import { render, screen } from '@testing-library/react'
import { createRef } from 'react'

import { FieldSet } from './FieldSet'

describe('FieldSet', () => {
  it('renders without heading when hasHeading is false', () => {
    render(<FieldSet hasHeading={false} legend="Test" />)

    const component = screen.getByRole('group', { name: 'Test' })
    const heading = screen.queryByRole('heading')

    expect(component).toBeInTheDocument()
    expect(heading).not.toBeInTheDocument()
  })

  it('renders with heading when hasHeading is true', () => {
    render(<FieldSet hasHeading legend="Test" />)

    const component = screen.getByRole('group', { name: 'Test' })
    const heading = screen.getByRole('heading', { name: 'Test' })

    expect(component).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
  })

  it('renders the error class', () => {
    render(<FieldSet hasHeading invalid legend="Test" />)

    const component = screen.getByRole('group', { name: 'Test' })

    expect(component).toHaveClass('ams-field-set--invalid')
  })

  it('renders an extra class name', () => {
    render(<FieldSet className="extra" hasHeading legend="Test" />)

    const component = screen.getByRole('group', { name: 'Test' })

    expect(component).toHaveClass('ams-field-set extra')
  })

  it('renders a design system BEM class name', () => {
    render(<FieldSet hasHeading legend="Test" />)

    const component = screen.getByRole('group', { name: 'Test' })

    expect(component).toHaveClass('ams-field-set')
  })

  it('renders the correct legend class name', () => {
    const { container } = render(<FieldSet hasHeading legend="Test" />)

    const component = container.querySelector('legend')

    expect(component).toHaveClass('ams-field-set__legend')
  })

  it('supports ForwardRef in React', () => {
    const ref = createRef<HTMLFieldSetElement>()

    render(<FieldSet hasHeading legend="Test" ref={ref} />)

    const component = screen.getByRole('group', { name: 'Test' })

    expect(ref.current).toBe(component)
  })

  it('renders the default hint text after the legend when hasHeading is true', () => {
    render(<FieldSet hasHeading legend="Legend" optional />)

    const component = screen.getByRole('group', { name: 'Legend (niet verplicht)' })

    expect(component).toBeInTheDocument()
  })

  it('renders the default hint text after the legend when hasHeading is false', () => {
    render(<FieldSet hasHeading={false} legend="Legend" optional />)

    const component = screen.getByRole('group', { name: 'Legend (niet verplicht)' })

    expect(component).toBeInTheDocument()
  })
})
