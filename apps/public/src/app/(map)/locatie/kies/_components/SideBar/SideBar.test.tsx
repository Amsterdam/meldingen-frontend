import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { SideBar } from './SideBar'

vi.mock('../../_utils', () => ({
  getAddressFromCoordinates: vi.fn().mockReturnValue('Nieuwmarkt 15, 1011JR Amsterdam'),
}))

describe('SideBar', () => {
  it('should render correctly', () => {
    render(<SideBar coordinates={null} />)

    const heading = screen.getByRole('heading', { name: 'Selecteer de locatie' })
    const paragraph = screen.getByRole('paragraph')

    expect(heading).toBeInTheDocument()
    expect(paragraph).toBeInTheDocument()
  })

  it('should render render address based on provided coordinates ', async () => {
    render(<SideBar coordinates={{ lat: 52.37239126063553, lon: 4.900905743712159 }} />)

    await waitFor(() => {
      expect(screen.getByText('Nieuwmarkt 15, 1011JR Amsterdam')).toBeInTheDocument()
    })
  })
})
