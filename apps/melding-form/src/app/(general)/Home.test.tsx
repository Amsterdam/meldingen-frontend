import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useActionState } from 'react'
import type { Mock } from 'vitest'

import { Home } from './Home'
import { textAreaComponent } from 'apps/melding-form/src/mocks/data'

const mockQuestionText = /What is it about?/ // This is a regex to account for the label text being dynamic

const mockTextAreaComponent = {
  ...textAreaComponent,
  label: mockQuestionText.source, // This converts the regex to a string
}

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

describe('Page', () => {
  it('should render a form', () => {
    render(<Home formData={[mockTextAreaComponent]} />)

    expect(screen.queryByRole('textbox', { name: mockQuestionText })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'submit-button' })).toBeInTheDocument()
  })

  it('should render an error message', () => {
    ;(useActionState as Mock).mockReturnValue([{ message: 'Test error message' }, vi.fn()])

    render(<Home formData={[mockTextAreaComponent]} />)

    expect(screen.queryByText('Test error message')).toBeInTheDocument()
  })

  it('should fetch defaultValues from localStorage', async () => {
    const store: Record<string, string> = { textArea1: 'Test input textarea' }

    global.localStorage = {
      getItem: vi.fn((key: string) => JSON.stringify(store[key]) ?? null),
    } as unknown as Storage

    render(<Home formData={[mockTextAreaComponent]} />)

    const textAreaInput = screen.getByRole('textbox', { name: 'What is it about? (niet verplicht)' })

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

    render(<Home formData={[mockTextAreaComponent]} />)

    const textAreaInput = screen.getByRole('textbox', { name: 'What is it about? (niet verplicht)' })

    await userEvent.type(textAreaInput, 'Foo bar')

    expect(global.localStorage.setItem).toHaveBeenCalledWith('textArea1', '"Foo bar"')
  })
})
