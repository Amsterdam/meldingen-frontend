import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Page from './page'

vi.mock('./AddNote', () => ({
  AddNote: vi.fn(() => <div>AddNote Component</div>),
}))

describe('Page', () => {
  it('renders the AddNote component when data is available', async () => {
    const params = Promise.resolve({ meldingId: 123 })

    const result = await Page({ params })

    render(result)

    expect(screen.getByText('AddNote Component')).toBeInTheDocument()
  })
})
