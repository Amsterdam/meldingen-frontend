import { screen, render, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import Page from './page'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

describe('Page', () => {
  it('should render', () => {
    const { container } = render(<Page />)

    const outerWrapper = container.querySelector('div')

    waitFor(() => {
      expect(outerWrapper).toBeInTheDocument()
    })

    const sideBar = screen.getByRole('heading', { name: 'Selecteer de locatie' })
    const addressComboBox = screen.getByRole('combobox', { name: 'Zoek op adres' })
    const toggleButton = screen.getByRole('button', { name: 'Lijst' })

    expect(sideBar).toBeInTheDocument()
    expect(addressComboBox).toBeInTheDocument()
    expect(toggleButton).toBeInTheDocument()
  })
})
