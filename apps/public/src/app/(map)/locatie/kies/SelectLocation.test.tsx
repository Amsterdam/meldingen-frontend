import { render, screen, waitFor } from '@testing-library/react'

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

    const sideBar = screen.getByRole('heading', { name: 'title' })
    const addressCombobox = screen.getByRole('combobox', { name: 'label' })
    const toggleButton = screen.getByRole('button', { name: 'toggle-button.list' })

    expect(sideBar).toBeInTheDocument()
    expect(addressCombobox).toBeInTheDocument()
    expect(toggleButton).toBeInTheDocument()
  })
})
