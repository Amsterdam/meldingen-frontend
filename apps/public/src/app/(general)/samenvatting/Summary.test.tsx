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

const mockData = [
  {
    key: '1',
    term: 'Term 1',
    description: ['Description 1'],
  },
  {
    key: '2',
    term: 'Term 2',
    description: ['Description 2'],
  },
]

describe('Summary', () => {
  it('renders the Summary component with data', () => {
    render(<Summary data={mockData} />)

    const terms = screen.getAllByRole('term')
    const definitions = screen.getAllByRole('definition')

    expect(terms[0]).toHaveTextContent('Term 1')
    expect(terms[1]).toHaveTextContent('Term 2')
    expect(definitions[0]).toHaveTextContent('Description 1')
    expect(definitions[1]).toHaveTextContent('Description 2')
  })

  it('renders the Summary component with an error message', () => {
    ;(useActionState as Mock).mockReturnValue([{ message: 'Test error message' }, vi.fn()])

    render(<Summary data={mockData} />)

    expect(screen.queryByText('Test error message')).toBeInTheDocument()
  })
})
