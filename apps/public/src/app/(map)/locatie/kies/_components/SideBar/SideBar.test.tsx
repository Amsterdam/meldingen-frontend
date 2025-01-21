import { render, screen, waitFor } from '@testing-library/react'

import { SideBar } from './SideBar'

describe('SideBar', () => {
  it('should render correctly', () => {
    render(<SideBar />)

    const heading = screen.getByRole('heading', { name: 'Selecteer de locatie' })
    const paragraph = screen.getByRole('paragraph')

    expect(heading).toBeInTheDocument()
    expect(paragraph).toBeInTheDocument()
  })

  it('should show an address based on provided coordinates ', async () => {
    render(<SideBar coordinates={{ lat: 52.37239126063553, lon: 4.900905743712159 }} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Nieuwmarkt 15, 1011JR Amsterdam')).toBeInTheDocument()
    })
  })
})
