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

describe('ClassificationCombobox', () => {
  it('renders the current classification in the visible input and hidden input', () => {
    const { container } = render(
      <ClassificationCombobox
        classifications={classifications}
        defaultValue="2"
        id="classification"
        name="classification"
        noResultsMessage="No results"
        placeholder="Search classifications"
      />,
    )

    expect(screen.getByRole('combobox')).toHaveValue('Category 1')
    expect(container.querySelector('input[type="hidden"][name="classification"]')).toHaveValue('2')
  })

  it('filters results while typing and updates the hidden value when an option is selected', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    const { container } = render(
      <ClassificationCombobox
        classifications={classifications}
        defaultValue="2"
        id="classification"
        name="classification"
        noResultsMessage="No results"
        onSelect={onSelect}
        placeholder="Search classifications"
      />,
    )

    const combobox = screen.getByRole('combobox')

    await user.clear(combobox)
    await user.type(combobox, '2')

    expect(container.querySelector('input[type="hidden"][name="classification"]')).toHaveValue('2')
    expect(screen.queryByRole('option', { name: 'Category 1' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Category 2' }))

    expect(combobox).toHaveValue('Category 2')
    expect(container.querySelector('input[type="hidden"][name="classification"]')).toHaveValue('3')
    expect(onSelect).toHaveBeenCalledWith(classifications[1])
  })

  it('shows the no-results message when the filter matches nothing', async () => {
    const user = userEvent.setup()

    render(
      <ClassificationCombobox
        classifications={classifications}
        defaultValue=""
        id="classification"
        name="classification"
        noResultsMessage="No results"
        placeholder="Search classifications"
      />,
    )

    const combobox = screen.getByRole('combobox')

    await user.type(combobox, 'unknown')

    expect(screen.getByRole('listitem')).toHaveTextContent('No results')
  })

  it('restores the provided default values when the props change', async () => {
    const user = userEvent.setup()

    const { container, rerender } = render(
      <ClassificationCombobox
        classifications={classifications}
        defaultValue="2"
        id="classification"
        name="classification"
        noResultsMessage="No results"
        placeholder="Search classifications"
      />,
    )

    const combobox = screen.getByRole('combobox')
    await user.clear(combobox)
    await user.type(combobox, 'draft')

    rerender(
      <ClassificationCombobox
        classifications={classifications}
        defaultValue="3"
        id="classification"
        name="classification"
        noResultsMessage="No results"
        placeholder="Search classifications"
      />,
    )

    expect(screen.getByRole('combobox')).toHaveValue('Category 2')
    expect(container.querySelector('input[type="hidden"][name="classification"]')).toHaveValue('3')
  })

  it('restores the last committed selection when the user blurs after typing', async () => {
    const user = userEvent.setup()

    const { container } = render(
      <>
        <ClassificationCombobox
          classifications={classifications}
          defaultValue="2"
          id="classification"
          name="classification"
          noResultsMessage="No results"
          placeholder="Search classifications"
        />
        <button type="button">Next field</button>
      </>,
    )

    const combobox = screen.getByRole('combobox')

    await user.clear(combobox)
    await user.type(combobox, '2')
    await user.tab()

    expect(combobox).toHaveValue('Category 1')
    expect(container.querySelector('input[type="hidden"][name="classification"]')).toHaveValue('2')
  })

  it('clears the typed value on blur when no selection has been committed', async () => {
    const user = userEvent.setup()

    const { container } = render(
      <>
        <ClassificationCombobox
          classifications={classifications}
          defaultValue=""
          id="classification"
          name="classification"
          noResultsMessage="No results"
          placeholder="Search classifications"
        />
        <button type="button">Next field</button>
      </>,
    )

    const combobox = screen.getByRole('combobox')

    await user.type(combobox, 'unknown')
    await user.tab()

    expect(combobox).toHaveValue('')
    expect(combobox).toHaveAttribute('placeholder', 'Search classifications')
    expect(container.querySelector('input[type="hidden"][name="classification"]')).toHaveValue('')
  })
})
