import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'
import type { Mock } from 'vitest'

import { AdditionalQuestions, type Props } from './AdditionalQuestions'
import { textAreaComponent } from 'apps/melding-form/src/mocks/data'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const defaultProps: Props = {
  action: vi.fn(),
  formComponents: [textAreaComponent],
  previousPanelPath: '/prev',
}

describe('AdditionalQuestions', () => {
  it('renders the form header', () => {
    render(<AdditionalQuestions {...defaultProps} />)

    const header = screen.getByRole('banner', { name: 'title' })

    expect(header).toBeInTheDocument()
  })

  it('renders form data', () => {
    render(<AdditionalQuestions {...defaultProps} />)

    const question = screen.getByRole('textbox', { name: /First question/ })

    expect(question).toBeInTheDocument()
  })

  it('should render an error message and keep input data', () => {
    const formData = new FormData()

    formData.append('textArea1', 'Er staan blowende jongeren')
    ;(useActionState as Mock).mockReturnValue([{ errorMessage: 'Test error message', formData }, vi.fn()])

    render(<AdditionalQuestions {...defaultProps} />)

    expect(screen.queryByText('Test error message')).toBeInTheDocument()
    expect(screen.queryByText('Er staan blowende jongeren')).toBeInTheDocument()
  })
})
