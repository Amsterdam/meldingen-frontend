import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ClassificationCombobox } from './ClassificationCombobox'

const classifications = [
  {
    created_at: '2024-01-01T00:00:00Z',
    id: 2,
    instructions: 'Instructions for Category 1',
    name: 'Category 1',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    created_at: '2024-01-01T00:00:00Z',
    id: 3,
    instructions: 'Instructions for Category 2',
    name: 'Category 2',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

const defaultProps = {
  classifications,
  id: 'classificationId',
  name: 'classificationId',
  noResultsMessage: 'No categories found',
  placeholder: 'Choose a category',
}

describe('ClassificationCombobox', () => {
  const getHiddenInput = (container: HTMLElement, name: string) =>
    container.querySelector(`input[type="hidden"][name="${name}"]`)

  it('renders the default classification name, instructions and submitted id', () => {
    const { container } = render(<ClassificationCombobox {...defaultProps} defaultValue={2} />)

    expect(screen.getByRole('combobox')).toHaveValue('Category 1')
    expect(screen.getByText('Instructions for Category 1')).toBeInTheDocument()
    expect(getHiddenInput(container, 'classificationId')).toHaveValue('2')
    expect(getHiddenInput(container, 'isClassificationEmpty')).toHaveValue('false')
    expect(getHiddenInput(container, 'isClassificationSelected')).toHaveValue('true')
  })

  it('renders the placeholder when there is no default classification', () => {
    const { container } = render(<ClassificationCombobox {...defaultProps} />)

    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Choose a category')
    expect(getHiddenInput(container, 'isClassificationEmpty')).toHaveValue('true')
    expect(getHiddenInput(container, 'isClassificationSelected')).toHaveValue('false')
  })

  it('forwards aria-describedby to the rendered combobox input', () => {
    render(<ClassificationCombobox {...defaultProps} ariaDescribedBy="classification-error" />)

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-describedby', 'classification-error')
  })

  it('filters classifications and selects a new one', async () => {
    const user = userEvent.setup()
    const { container } = render(<ClassificationCombobox {...defaultProps} defaultValue={2} />)

    const combobox = screen.getByRole('combobox')

    await user.clear(combobox)
    await user.type(combobox, '2')

    expect(screen.queryByRole('option', { name: 'Category 1' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Category 2' }))

    expect(combobox).toHaveValue('Category 2')
    expect(screen.getByText('Instructions for Category 2')).toBeInTheDocument()
    expect(getHiddenInput(container, 'classificationId')).toHaveValue('3')
    expect(getHiddenInput(container, 'isClassificationEmpty')).toHaveValue('false')
    expect(getHiddenInput(container, 'isClassificationSelected')).toHaveValue('true')
  })

  it('marks the input as unselected when the user types a value without choosing an option', async () => {
    const user = userEvent.setup()
    const { container } = render(<ClassificationCombobox {...defaultProps} defaultValue={2} />)

    const combobox = screen.getByRole('combobox')

    await user.clear(combobox)
    await user.type(combobox, 'Unknown')

    expect(combobox).toHaveValue('Unknown')
    expect(getHiddenInput(container, 'classificationId')).toHaveValue('2')
    expect(getHiddenInput(container, 'isClassificationEmpty')).toHaveValue('false')
    expect(getHiddenInput(container, 'isClassificationSelected')).toHaveValue('false')
  })

  it('shows the no results message when no classifications match', async () => {
    const user = userEvent.setup()

    render(<ClassificationCombobox {...defaultProps} />)

    const combobox = screen.getByRole('combobox')

    await user.type(combobox, 'Unknown')

    expect(screen.getByRole('option', { name: 'No categories found' })).toBeInTheDocument()
  })
})
