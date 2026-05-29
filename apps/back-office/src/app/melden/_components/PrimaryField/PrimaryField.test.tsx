import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { PrimaryField } from './PrimaryField'
import { textAreaComponent } from '~/mocks/data'

const defaultProps = {
  config: textAreaComponent,
  defaultValue: '',
  prefetchedMelding: null,
  setPrefetchedMelding: vi.fn(),
}

describe('PrimaryField', () => {
  it('renders the primary field with the correct label and description', () => {
    render(<PrimaryField {...defaultProps} />)

    const input = screen.getByRole('textbox', { name: textAreaComponent.label })

    expect(input).toBeInTheDocument()
    expect(input).toHaveAccessibleDescription(textAreaComponent.description)
  })

  it('initializes the character count with 0', () => {
    render(<PrimaryField {...defaultProps} />)

    expect(screen.getByText(`0 van ${textAreaComponent.maxCharCount} tekens`)).toBeInTheDocument()
  })

  it('updates the character count when the user types in the textarea', async () => {
    const user = userEvent.setup()

    render(<PrimaryField {...defaultProps} />)

    await user.type(screen.getByRole('textbox', { name: textAreaComponent.label }), 'Hello')

    expect(screen.getByText(`5 van ${textAreaComponent.maxCharCount} tekens`)).toBeInTheDocument()
  })

  it('does not render the character count when maxCharCount is not provided', () => {
    render(<PrimaryField {...defaultProps} config={{ ...textAreaComponent, maxCharCount: null }} />)

    expect(screen.queryByText(/tekens/)).not.toBeInTheDocument()
  })

  it('does not update the character count when maxCharCount is not provided and the user types', async () => {
    const user = userEvent.setup()

    render(<PrimaryField {...defaultProps} config={{ ...textAreaComponent, maxCharCount: null }} />)

    await user.type(screen.getByRole('textbox', { name: textAreaComponent.label }), 'Hello')

    expect(screen.queryByText(/tekens/)).not.toBeInTheDocument()
  })
})
