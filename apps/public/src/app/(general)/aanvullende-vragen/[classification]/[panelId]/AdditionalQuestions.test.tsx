import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'
import type { Mock } from 'vitest'

import { AdditionalQuestions } from './AdditionalQuestions'
import mockFormData from 'apps/public/src/mocks/mockFormData.json'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const defaultProps = {
  action: vi.fn(),
  formData: mockFormData.components[0].components,
  previousPanelPath: '/prev',
}

describe('AdditionalQuestions', () => {
  it('renders a heading', () => {
    render(<AdditionalQuestions {...defaultProps} />)

    const heading = screen.getByRole('heading', { name: 'step.title' })

    expect(heading).toBeInTheDocument()
  })

  it('renders form data', () => {
    render(<AdditionalQuestions {...defaultProps} />)

    const question = screen.getByRole('textbox', { name: /First question/ })

    expect(question).toBeInTheDocument()
  })

  it('should render an error message', () => {
    ;(useActionState as Mock).mockReturnValue([{ message: 'Test error message' }, vi.fn()])

    render(<AdditionalQuestions {...defaultProps} />)

    expect(screen.queryByText('Test error message')).toBeInTheDocument()
  })
})
