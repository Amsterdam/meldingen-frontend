import { render, screen, waitFor } from '@testing-library/react'

import Page from './page'

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
