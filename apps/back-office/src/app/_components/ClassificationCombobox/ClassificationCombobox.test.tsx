import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ClassificationCombobox } from './ClassificationCombobox'
import { classifications } from '~/mocks/data'

const defaultProps = {
  classifications,
  label: 'Choose classification',
  noResultsMessage: 'No categories found',
  placeholder: 'Choose a category',
}

const getHiddenInput = (container: HTMLElement) =>
  container.querySelector('input[type="hidden"][name="classificationId"]')

describe('ClassificationCombobox', () => {
  it('renders the default classification name, instructions and submitted id', () => {
    const { container } = render(<ClassificationCombobox {...defaultProps} defaultValue="Category 1" />)

    expect(screen.getByRole('combobox')).toHaveValue('Category 1')
    expect(screen.getByText('Instructions for Category 1')).toBeInTheDocument()
    expect(getHiddenInput(container)).toHaveValue('1')
  })

  it('renders a default value that does not match a classification without selecting one', () => {
    const { container } = render(<ClassificationCombobox {...defaultProps} defaultValue="Unknown" />)

    expect(screen.getByRole('combobox')).toHaveValue('Unknown')
    expect(getHiddenInput(container)).toHaveValue('')
  })

  it('renders the placeholder when there is no default classification', () => {
    const { container } = render(<ClassificationCombobox {...defaultProps} />)

    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Choose a category')
    expect(getHiddenInput(container)).toHaveValue('')
  })

  it('shows all classification options when a prefilled combobox is clicked', async () => {
    const user = userEvent.setup()

    render(<ClassificationCombobox {...defaultProps} defaultValue="Category 1" />)

    await user.tab()

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')

    await user.click(screen.getByRole('combobox'))

    expect(screen.getByRole('option', { name: 'Category 1' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Category 2' })).toBeInTheDocument()
  })

  it('renders the label, error message and invalid state', () => {
    render(<ClassificationCombobox {...defaultProps} errorMessage="classification-required" />)

    expect(screen.getByRole('combobox', { name: 'Choose classification' })).toHaveAccessibleDescription(
      /classification-required/i,
    )
    expect(screen.getByRole('combobox', { name: 'Choose classification' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('filters classifications and selects a new one', async () => {
    const user = userEvent.setup()
    const { container } = render(<ClassificationCombobox {...defaultProps} defaultValue="Category 1" />)

    const combobox = screen.getByRole('combobox')

    await user.clear(combobox)
    await user.type(combobox, '2')

    expect(screen.queryByRole('option', { name: 'Category 1' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Category 2' }))

    expect(combobox).toHaveValue('Category 2')
    expect(screen.getByText('Instructions for Category 2')).toBeInTheDocument()
    expect(getHiddenInput(container)).toHaveValue('2')
  })

  it('marks the input as unselected when the user types a value without choosing an option', async () => {
    const user = userEvent.setup()
    const { container } = render(<ClassificationCombobox {...defaultProps} defaultValue="Category 1" />)

    const combobox = screen.getByRole('combobox')

    await user.clear(combobox)
    await user.type(combobox, 'Unknown')

    expect(combobox).toHaveValue('Unknown')
    expect(getHiddenInput(container)).toHaveValue('')
  })

  it('selects a classification when the user types its exact name without choosing an option', async () => {
    const user = userEvent.setup()
    const { container } = render(<ClassificationCombobox {...defaultProps} />)

    await user.type(screen.getByRole('combobox'), 'Category 2')

    expect(screen.getByText('Instructions for Category 2')).toBeInTheDocument()
    expect(getHiddenInput(container)).toHaveValue('2')
  })

  it('shows the no results message when no classifications match', async () => {
    const user = userEvent.setup()

    render(<ClassificationCombobox {...defaultProps} />)

    const combobox = screen.getByRole('combobox')

    await user.type(combobox, 'Unknown')

    expect(screen.getByRole('option', { name: 'No categories found' })).toBeInTheDocument()
  })
})
