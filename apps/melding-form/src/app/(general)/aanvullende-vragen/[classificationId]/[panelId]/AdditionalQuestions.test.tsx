import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useActionState } from 'react'
import type { Mock } from 'vitest'

import { AdditionalQuestions } from './AdditionalQuestions'
import { textAreaComponent } from 'apps/melding-form/src/mocks/data'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const defaultProps = {
  action: vi.fn(),
  formData: [textAreaComponent],
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

  it('should fetch defaultValues from localStorage', async () => {
    const store: Record<string, string> = { textArea1: 'Test input textarea' }

    global.localStorage = {
      getItem: vi.fn((key: string) => JSON.stringify(store[key]) ?? null),
    } as unknown as Storage

    render(<AdditionalQuestions {...defaultProps} />)

    const textAreaInput = screen.getByRole('textbox', { name: 'First question (niet verplicht)' })

    expect(textAreaInput).toHaveValue('Test input textarea')
  })

  it('should handle onChange and set value in localStorage', async () => {
    const store: Record<string, string> = { textArea1: '' }

    global.localStorage = {
      getItem: vi.fn((key: string) => JSON.stringify(store[key]) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value
      }),
    } as unknown as Storage

    render(<AdditionalQuestions {...defaultProps} />)

    const textAreaInput = screen.getByRole('textbox', { name: 'First question (niet verplicht)' })

    await userEvent.type(textAreaInput, 'Foo bar')

    expect(global.localStorage.setItem).toHaveBeenCalledWith('textArea1', '"Foo bar"')
  })
})
