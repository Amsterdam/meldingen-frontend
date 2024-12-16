import { render, screen, waitFor } from '@testing-library/react'

import { Home } from './Home'

const mockQuestionText = /What is it about?/ // This is a regex to account for the label text being dynamic

const mockFormData = [
  {
    type: 'textarea',
    key: 'what',
    label: mockQuestionText.source, // This converts the regex to a string
    description: '',
    input: true,
    inputType: 'text',
    showCharCount: false,
    position: 0,
  },
]

describe('Page', () => {
  it('should render a form', async () => {
    render(<Home formData={mockFormData} />)

    await waitFor(() => {
      expect(screen.queryByRole('textbox', { name: mockQuestionText })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Volgende vraag' })).toBeInTheDocument()
    })
  })
})
