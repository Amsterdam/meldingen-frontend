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

  it('should render an error message', () => {
    ;(useActionState as Mock).mockReturnValue([{ message: 'Test error message' }, vi.fn()])

    render(<Home formComponents={[mockTextAreaComponent]} />)

    expect(screen.queryByText('Test error message')).toBeInTheDocument()
  })
})
