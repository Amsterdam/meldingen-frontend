import type { ReactNode } from 'react'

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useStateAction } from 'next-safe-action/hooks'

import type { Props } from './ChangeCategory'

import { ChangeCategory } from './ChangeCategory'

const { mockNextForm } = vi.hoisted(() => ({
  mockNextForm: vi.fn(),
}))

type UseStateActionResult = ReturnType<typeof useStateAction>

const createUseStateActionResult = (overrides: Partial<UseStateActionResult> = {}): UseStateActionResult =>
  ({
    execute: vi.fn(),
    executeAsync: vi.fn(),
    formAction: vi.fn(),
    hasErrored: false,
    hasNavigated: false,
    hasSucceeded: false,
    input: undefined,
    isExecuting: false,
    isIdle: true,
    isPending: false,
    isTransitioning: false,
    reset: vi.fn(),
    result: {
      data: undefined,
      serverError: undefined,
      validationErrors: undefined,
    },
    status: 'idle',
    ...overrides,
  }) as unknown as UseStateActionResult

const createErroredUseStateActionResult = (
  overrides: Partial<Pick<UseStateActionResult, 'formAction' | 'input' | 'isPending' | 'result'>>,
): UseStateActionResult =>
  ({
    execute: vi.fn(),
    executeAsync: vi.fn(),
    formAction: vi.fn(),
    hasErrored: true,
    hasNavigated: false,
    hasSucceeded: false,
    input: undefined,
    isExecuting: false,
    isIdle: false,
    isPending: false,
    isTransitioning: false,
    reset: vi.fn(),
    result: {
      data: undefined,
      serverError: undefined,
      validationErrors: undefined,
    },
    status: 'hasErrored',
    ...overrides,
  }) as unknown as UseStateActionResult

vi.mock('next-safe-action/hooks', () => ({
  useStateAction: vi.fn(),
}))

vi.mock('next/form', () => ({
  default: (props: { children: ReactNode }) => {
    mockNextForm(props)

    return <form>{props.children}</form>
  },
}))

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
  beforeEach(() => {
    vi.mocked(useStateAction).mockReturnValue(createUseStateActionResult())
  })

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
    vi.mocked(useStateAction).mockReturnValueOnce(
      createErroredUseStateActionResult({
        formAction: vi.fn(),
        input: {
          category: '3',
          reason: 'Because this is the right category',
        },
        isPending: false,
        result: {
          validationErrors: {
            category: { _errors: ['errors.category-required'] },
            reason: { _errors: ['errors.reason-required'] },
          },
        },
      }),
    )

    render(<ChangeCategory {...defaultProps} />)

    expect(screen.getByText('errors.category-required')).toBeInTheDocument()
    expect(screen.getByText('errors.reason-required')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'form-labels.category' })).toHaveValue('3')
    expect(screen.getByRole('textbox', { name: 'form-labels.reason' })).toHaveValue(
      'Because this is the right category',
    )
  })

  it('displays a server error alert with the correct document title', () => {
    vi.mocked(useStateAction).mockReturnValueOnce(
      createErroredUseStateActionResult({
        formAction: vi.fn(),
        input: undefined,
        isPending: false,
        result: { serverError: 'Something went wrong while executing the operation.' },
      }),
    )

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
    const mockFormAction = vi.fn()
    vi.mocked(useStateAction).mockReturnValueOnce(
      createUseStateActionResult({
        formAction: mockFormAction,
        input: undefined,
        isPending: false,
      }),
    )

    render(<ChangeCategory {...defaultProps} />)

    const formProps = mockNextForm.mock.calls.at(-1)?.[0] as { action?: (formData: FormData) => void }
    const formData = new FormData()
    formData.set('category', '3')
    formData.set('reason', 'Need to correct the classification')

    formProps.action?.(formData)

    expect(mockFormAction).toHaveBeenCalledWith({
      category: '3',
      reason: 'Need to correct the classification',
    })
  })
})
