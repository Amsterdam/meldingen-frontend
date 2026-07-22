import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Page, { generateMetadata } from './page'

vi.mock('./AddNote', () => ({
  AddNote: vi.fn(() => <div>AddNote Component</div>),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  it('renders', async () => {
    const params = Promise.resolve({ meldingId: 123 })

    const result = await Page({ params })

    render(result)

    expect(screen.getByText('AddNote Component')).toBeInTheDocument()
  })
})
