import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import mockFormData from 'apps/public/src/mocks/mockFormData.json'

import { AanvullendeVragen } from './AanvullendeVragen'

describe('AanvullendeVragen', () => {
  it('renders a heading', () => {
    const action = vi.fn()

    render(<AanvullendeVragen action={action} formData={mockFormData.components[0].components} />)

    const heading = screen.getByRole('heading', { name: 'Beschrijf uw melding' })

    expect(heading).toBeInTheDocument()
  })

  it('renders form data', () => {
    const action = vi.fn()

    render(<AanvullendeVragen action={action} formData={mockFormData.components[0].components} />)

    const question = screen.getByRole('textbox', { name: /First question/ })

    expect(question).toBeInTheDocument()
  })
})
