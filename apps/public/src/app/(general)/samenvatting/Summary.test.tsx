import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'
import type { Mock } from 'vitest'
import { vi } from 'vitest'

import { Summary } from './Summary'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const mockData = {
  additionalQuestions: [
    {
      key: '1',
      term: 'Text Field 1',
      description: ['Antwoord vraag 1'],
    },
    {
      key: '2',
      term: 'Text Area 2',
      description: ['Antwoord vraag 2'],
    },
  ],
  contact: {
    key: 'contact',
    term: 'Wat zijn uw contactgegevens?',
    description: ['test@test.com', '+31612345678'],
  },
  location: {
    key: 'location',
    term: 'Waar staat de container?',
    description: ['Nieuwmarkt 247, 1011MB Amsterdam'],
  },
  melding: {
    key: 'primary',
    term: 'Wat wilt u melden?',
    description: ['Er ligt heel veel afval op straat.'],
  },
}

describe('Summary', () => {
  beforeAll(() => {
    global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/uploaded-file-1')
  })

  it('renders the Summary component with data', () => {
    render(<Summary {...mockData} />)
    screen.debug()
    const terms = screen.getAllByRole('term')
    const definitions = screen.getAllByRole('definition')

    expect(terms[0]).toHaveTextContent('Wat wilt u melden?')
    expect(terms[1]).toHaveTextContent('Text Field 1')
    expect(terms[2]).toHaveTextContent('Text Area 2')
    expect(terms[3]).toHaveTextContent('Waar staat de container?')
    expect(terms[4]).toHaveTextContent('Wat zijn uw contactgegevens?')

    expect(definitions[0]).toHaveTextContent('Er ligt heel veel afval op straat.')
    expect(definitions[1]).toHaveTextContent('Antwoord vraag 1')
    expect(definitions[2]).toHaveTextContent('Antwoord vraag 2')
    expect(definitions[3]).toHaveTextContent('Nieuwmarkt 247, 1011MB Amsterdam')
    expect(definitions[4]).toHaveTextContent('test@test.com')
    expect(definitions[5]).toHaveTextContent('+31612345678')

    expect(screen.getByRole('button', { name: 'submit-button' }))
  })

  it('renders the Summary component with an error message', () => {
    ;(useActionState as Mock).mockReturnValue([{ message: 'Test error message' }, vi.fn()])

    render(<Summary {...mockData} />)

    expect(screen.queryByText('Test error message')).toBeInTheDocument()
  })
})
