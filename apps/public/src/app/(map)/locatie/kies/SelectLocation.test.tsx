import { screen, render, waitFor } from '@testing-library/react'

import { SelectLocation } from './SelectLocation'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

describe('SelectLocation', () => {
  it('should render', () => {
    const { container } = render(<SelectLocation />)

    const outerWrapper = container.querySelector('div')

    waitFor(() => {
      expect(outerWrapper).toBeInTheDocument()
    })

    const sideBar = screen.getByRole('heading', { name: 'Selecteer de locatie' })
    const addressCombobox = screen.getByRole('combobox', { name: 'Zoek op adres' })
    const toggleButton = screen.getByRole('button', { name: 'Lijst' })

    expect(sideBar).toBeInTheDocument()
    expect(addressCombobox).toBeInTheDocument()
    expect(toggleButton).toBeInTheDocument()
  })
})
