import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'
import type { Mock } from 'vitest'

import { Home } from './Home'
import { textAreaComponent } from 'apps/melding-form/src/mocks/data'

const mockQuestionText = /What is it about?/ // This is a regex to account for the label text being dynamic

const mockTextAreaComponent = {
  ...textAreaComponent,
  label: mockQuestionText.source, // This converts the regex to a string
}

const defaultProps = {
  action: vi.fn(),
  formComponents: [mockTextAreaComponent],
}

vi.mock('react', async (importOriginal) => {
  const formData = new FormData()
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{ formData, message: '' }, vi.fn()]),
  }
})

describe('Page', () => {
  it('renders an error message and keeps input data', () => {
    const formData = new FormData()

    formData.append('textArea1', 'Er staan blowende jongeren')
    ;(useActionState as Mock).mockReturnValue([{ systemError: 'Test error message', formData }, vi.fn()])

    render(<Home {...defaultProps} />)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveTextContent('system-error-alert-title')

    const input = screen.getByRole('textbox')

    expect(input).toHaveValue('Er staan blowende jongeren')
  })

  it('renders an Invalid Form Alert when there are validation errors', () => {
    ;(useActionState as Mock).mockReturnValue([
      { validationErrors: [{ key: 'key1', message: 'Test error message' }] },
      vi.fn(),
    ])

    render(<Home {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'Test error message' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#key1')
  })

  it('renders a form', () => {
    render(<Home {...defaultProps} />)

    expect(screen.queryByRole('textbox', { name: mockQuestionText })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'submit-button' })).toBeInTheDocument()
  })

  it('renders a default value in the input when provided', () => {
    render(
      <Home {...defaultProps} formComponents={[{ ...textAreaComponent, defaultValue: 'Default value from server' }]} />,
    )

    const input = screen.getByRole('textbox')

    expect(input).toHaveValue('Default value from server')
  })

  it('prioritizes form data returned by the action over the initial defaultValue', () => {
    const formData = new FormData()

    formData.append('textArea1', 'Form data from action')
    ;(useActionState as Mock).mockReturnValue([{ formData }, vi.fn()])

    render(
      <Home {...defaultProps} formComponents={[{ ...textAreaComponent, defaultValue: 'Default value from server' }]} />,
    )

    const input = screen.getByRole('textbox')

    expect(input).toHaveValue('Form data from action')
  })
})
