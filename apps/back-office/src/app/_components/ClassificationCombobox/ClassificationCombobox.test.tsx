import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ClassificationCombobox } from './ClassificationCombobox'

const classifications = [
  {
    created_at: '2024-01-01T00:00:00Z',
    id: 2,
    name: 'Category 1',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    created_at: '2024-01-01T00:00:00Z',
    id: 3,
    name: 'Category 2',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

const defaultProps = {
  classifications,
  id: 'classification',
  name: 'classification',
  noResultsMessage: 'No categories found',
  placeholder: 'Choose a category',
}

describe('ClassificationCombobox', () => {
  it('renders the default classification name and submitted id', () => {
    const { container } = render(<ClassificationCombobox {...defaultProps} defaultValue="2" />)

    expect(screen.getByRole('combobox')).toHaveValue('Category 1')
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('2')
  })

  it('renders the placeholder when there is no default classification', () => {
    render(<ClassificationCombobox {...defaultProps} />)

    expect(screen.getByRole('combobox')).toHaveAttribute('placeholder', 'Choose a category')
  })

  it('filters classifications and selects a new one', async () => {
    const user = userEvent.setup()
    const { container } = render(<ClassificationCombobox {...defaultProps} defaultValue="2" />)

    const combobox = screen.getByRole('combobox')

    await user.clear(combobox)
    await user.type(combobox, '2')

    expect(screen.queryByRole('option', { name: 'Category 1' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Category 2' }))

    expect(combobox).toHaveValue('Category 2')
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('3')
  })

  it('shows the no results message when no classifications match', async () => {
    const user = userEvent.setup()

    render(<ClassificationCombobox {...defaultProps} />)

    const combobox = screen.getByRole('combobox')

    await user.type(combobox, 'Unknown')

    expect(screen.getByRole('option', { name: 'No categories found' })).toBeInTheDocument()
  })

  it('reverts to the last selected classification on blur after uncommitted input', async () => {
    const user = userEvent.setup()
    const { container } = render(<ClassificationCombobox {...defaultProps} defaultValue="2" />)

    const combobox = screen.getByRole('combobox')

    await user.clear(combobox)
    await user.type(combobox, 'Other category')

    expect(container.querySelector('input[type="hidden"]')).toHaveValue('')

    await user.tab()

    expect(combobox).toHaveValue('Category 1')
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('2')
  })
})
