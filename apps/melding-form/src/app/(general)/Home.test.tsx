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
    ;(useActionState as Mock).mockReturnValue([{ errorMessage: 'Test error message', formData }, vi.fn()])

    render(<Home formComponents={[mockTextAreaComponent]} />)

    expect(screen.queryByText('Test error message')).toBeInTheDocument()
    expect(screen.queryByText('Er staan blowende jongeren')).toBeInTheDocument()
  })

  it('renders an Invalid Form Alert when there are validation errors', () => {
    ;(useActionState as Mock).mockReturnValue([
      { validationErrors: [{ key: 'key1', message: 'Test error message' }] },
      vi.fn(),
    ])

    render(<Home formComponents={[mockTextAreaComponent]} />)

    const link = screen.getByRole('link', { name: 'Test error message' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#key1')
  })

  it('renders a form', () => {
    render(<Home formComponents={[mockTextAreaComponent]} />)

    expect(screen.queryByRole('textbox', { name: mockQuestionText })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'submit-button' })).toBeInTheDocument()
  })
})
