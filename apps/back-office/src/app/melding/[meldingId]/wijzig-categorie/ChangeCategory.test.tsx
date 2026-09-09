import type { Mock } from 'vitest'

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useActionState } from 'react'

import type { Props } from './ChangeCategory'

import { ChangeCategory } from './ChangeCategory'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn(), false]),
  }
})

const defaultProps: Props = {
  classifications: [
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
  ],
  meldingClassification: {
    created_at: '2024-01-01T00:00:00Z',
    id: 2,
    name: 'Category 1',
    updated_at: '2024-01-01T00:00:00Z',
  },
  meldingId: 123,
  publicId: 'ABC',
}

describe('ChangeCategory', () => {
  it('renders the component with the correct document title', () => {
    render(<ChangeCategory {...defaultProps} />)

    expect(document.title).toBe('metadata.title')
  })

  it('renders the backlink', () => {
    render(<ChangeCategory {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/melding/123')
  })

  it('renders the title and form fields', () => {
    render(<ChangeCategory {...defaultProps} />)

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'form-labels.category' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'form-labels.reason' })).toBeInTheDocument()
  })

  it('renders the category options and defaults to the current category', () => {
    render(<ChangeCategory {...defaultProps} />)

    const select = screen.getByRole('combobox', { name: 'form-labels.category' })

    expect(select).toHaveValue('2')
    expect(screen.getByRole('option', { name: 'Category 1' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Category 2' })).toBeInTheDocument()
  })

  it('renders a placeholder option when no current category exists', () => {
    render(<ChangeCategory {...defaultProps} meldingClassification={null} />)

    expect(screen.getByRole('option', { name: '-- Kies categorie --' })).toBeInTheDocument()
  })

  it('renders the cancel link', () => {
    render(<ChangeCategory {...defaultProps} />)

    const cancelLink = screen.getByRole('link', { name: 'cancel-link' })

    expect(cancelLink).toBeInTheDocument()
    expect(cancelLink).toHaveAttribute('href', '/melding/123')
  })

  it('updates the character count when the reason changes', async () => {
    const user = userEvent.setup()

    render(<ChangeCategory {...defaultProps} />)

    const reasonField = screen.getByRole('textbox', { name: 'form-labels.reason' })
    await user.type(reasonField, 'abc')

    expect(screen.getByRole('status')).toHaveTextContent('3 van 1000 tekens')
  })

  it('displays validation errors and preserves the reason when the action returns validation errors', () => {
    const formData = new FormData()
    formData.set('reason', 'Because this is the right category')

    ;(useActionState as Mock).mockReturnValueOnce([
      {
        formData,
        validationErrors: [
          { key: 'category-id', message: 'errors.category-required' },
          { key: 'reason', message: 'errors.reason-required' },
        ],
      },
      vi.fn(),
      false,
    ])

    render(<ChangeCategory {...defaultProps} />)

    expect(screen.getByText('errors.category-required')).toBeInTheDocument()
    expect(screen.getByText('errors.reason-required')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'form-labels.reason' })).toHaveValue(
      'Because this is the right category',
    )
  })

  it('displays an API error alert with the correct document title', () => {
    ;(useActionState as Mock).mockReturnValueOnce([{ apiError: { detail: 'Error message' } }, vi.fn(), false])

    const { container } = render(<ChangeCategory {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')
    const heading = within(alert as HTMLElement).getByRole('heading', {
      name: 'errors.category-change-failed-heading',
    })

    expect(alert).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(alert).toHaveTextContent('description')
    expect(document.title).toBe('errors.category-change-failed-heading - metadata.title')
  })

  it('submits the form when the submit button is clicked', async () => {
    const user = userEvent.setup()

    const mockFormAction = vi.fn()
    ;(useActionState as Mock).mockReturnValueOnce([{}, mockFormAction, false])

    render(<ChangeCategory {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: 'submit-button' })
    await user.click(submitButton)

    expect(mockFormAction).toHaveBeenCalled()
  })
})
