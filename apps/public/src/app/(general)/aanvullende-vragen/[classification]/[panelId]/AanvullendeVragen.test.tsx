import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'
import type { Mock } from 'vitest'

import mockFormData from 'apps/public/src/mocks/mockFormData.json'

import { AanvullendeVragen } from './AanvullendeVragen'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

describe('AanvullendeVragen', () => {
  it('renders a heading', () => {
    const action = vi.fn()

    render(
      <AanvullendeVragen action={action} formData={mockFormData.components[0].components} previousPanelPath="/prev" />,
    )

    const heading = screen.getByRole('heading', { name: 'Beschrijf uw melding' })

    expect(heading).toBeInTheDocument()
  })

  it('renders form data', () => {
    const action = vi.fn()

    render(
      <AanvullendeVragen action={action} formData={mockFormData.components[0].components} previousPanelPath="/prev" />,
    )

    const question = screen.getByRole('textbox', { name: /First question/ })

    expect(question).toBeInTheDocument()
  })

  it('should render an error message', () => {
    ;(useActionState as Mock).mockReturnValue([{ message: 'Test error message' }, vi.fn()])

    const action = vi.fn()

    render(
      <AanvullendeVragen action={action} formData={mockFormData.components[0].components} previousPanelPath="/prev" />,
    )

    expect(screen.queryByText('Test error message')).toBeInTheDocument()
  })
})
