import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ClassificationField } from './ClassificationField'
import { classifications } from '~/mocks/data'

const label = 'label'

describe('ClassificationField', () => {
  it('renders an empty combobox with the label', () => {
    render(<ClassificationField classifications={classifications} />)

    expect(screen.getByRole('combobox', { name: label })).toHaveValue('')
  })

  it('renders the classification name and instructions if a default value is provided', () => {
    render(<ClassificationField classifications={classifications} derivedClassification="Category 1" />)

    expect(screen.getByRole('combobox', { name: label })).toHaveValue('Category 1')
    expect(screen.getByText('Instructions for Category 1')).toBeInTheDocument()
  })

  it('disables the combobox', () => {
    render(<ClassificationField classifications={classifications} isDisabled />)

    expect(screen.getByRole('combobox', { name: label })).toBeDisabled()
  })

  it('is enabled by default', () => {
    render(<ClassificationField classifications={classifications} />)

    expect(screen.getByRole('combobox', { name: label })).toBeEnabled()
  })

  it('updates the value when the derivedClassification changes', () => {
    const { rerender } = render(
      <ClassificationField classifications={classifications} derivedClassification="Category 1" />,
    )

    rerender(<ClassificationField classifications={classifications} derivedClassification="Category 2" />)

    expect(screen.getByRole('combobox', { name: label })).toHaveValue('Category 2')
    expect(screen.getByText('Instructions for Category 2')).toBeInTheDocument()
  })

  it('sets the value when a default value appears after an empty one', () => {
    const { rerender } = render(<ClassificationField classifications={classifications} />)

    rerender(<ClassificationField classifications={classifications} derivedClassification="Category 2" />)

    expect(screen.getByRole('combobox', { name: label })).toHaveValue('Category 2')
  })

  it('renders the no results message when the query matches nothing', async () => {
    const user = userEvent.setup()

    render(<ClassificationField classifications={classifications} />)

    await user.type(screen.getByRole('combobox', { name: label }), 'zzz')

    expect(await screen.findByText('no-results')).toBeInTheDocument()
  })
})
