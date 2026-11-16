import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Page, { generateMetadata } from './page'

vi.mock('./AddNote', () => ({
  AddNote: vi.fn(() => <div>AddNote Component</div>),
}))

describe('Page', () => {
  it('generates the document title metadata', async () => {
    expect(await generateMetadata()).toEqual({ title: 'metadata.title' })
  })

  it('renders', async () => {
    const params = Promise.resolve({ meldingId: '123' })

    const result = await Page({ params })

    render(result)

    expect(screen.getByText('AddNote Component')).toBeInTheDocument()
  })
})
