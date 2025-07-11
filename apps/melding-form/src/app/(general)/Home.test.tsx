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
  class MockFormData {
    private data: Record<string, string | File> = {}

    append(key: string, value: string | File) {
      this.data[key] = value
    }

    set(key: string, value: string | File) {
      this.data[key] = value
    }

    get(key: string): string | File | null {
      return this.data[key] ?? null
    }

    has(key: string): boolean {
      return key in this.data
    }

    delete(key: string) {
      delete this.data[key]
    }

    entries(): [string, string | File][] {
      return Object.entries(this.data)
    }
  }
  const formData = new MockFormData()
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{ formData, message: '' }, vi.fn()]),
  }
})

describe('Page', () => {
  it('should render a form', () => {
    render(<Home formComponents={[mockTextAreaComponent]} />)

    expect(screen.queryByRole('textbox', { name: mockQuestionText })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'submit-button' })).toBeInTheDocument()
  })

  it.only('should render an error message', () => {
    ;(useActionState as Mock).mockReturnValue([{ message: 'Test error message' }, vi.fn()])

    render(<Home formComponents={[mockTextAreaComponent]} />)

    expect(screen.queryByText('Test error message')).toBeInTheDocument()
  })

  it('should fetch defaultValues from localStorage', () => {
    const store: Record<string, string> = { textArea1: 'Test input textarea' }

    global.localStorage = {
      getItem: vi.fn((key: string) => JSON.stringify(store[key]) ?? null),
    } as unknown as Storage

    render(<Home formComponents={[mockTextAreaComponent]} />)

    const textAreaInput = screen.getByRole('textbox', { name: 'What is it about? (niet verplicht)' })

    expect(textAreaInput).toHaveValue('Test input textarea')
  })

  it('should handle onChange and set value in localStorage', async () => {
    const store: Record<string, string> = {}

    global.localStorage = {
      getItem: vi.fn((key: string) => JSON.stringify(store[key]) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value
      }),
    } as unknown as Storage

    render(<Home formComponents={[mockTextAreaComponent]} />)

    const textAreaInput = screen.getByRole('textbox', { name: 'What is it about? (niet verplicht)' })

    await userEvent.type(textAreaInput, 'Foo bar')

    expect(global.localStorage.setItem).toHaveBeenCalledWith('textArea1', '"Foo bar"')
  })
})
