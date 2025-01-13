import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { SideBar } from './SideBar'

vi.mock('../../utils', () => ({
  getAddressFromCoordinates: vi.fn().mockReturnValue({
    response: {
      numFound: 1,
      start: 0,
      maxScore: 7.2280917,
      numFoundExact: true,
      docs: [
        {
          type: 'adres',
          weergavenaam: 'Nieuwmarkt 15, 1011JR Amsterdam',
          id: 'adr-758e934b8651217819abcf0e60a45b39',
          score: 7.2280917,
          afstand: 1.8,
        },
      ],
    },
  }),
}))

describe('SideBar', () => {
  it('should render correctly', () => {
    render(<SideBar coordinates={{ lat: 52.37239126063553, lon: 4.900905743712159 }} />)

    const heading = screen.getByRole('heading', { name: 'Selecteer de locatie' })
    const paragraph = screen.getByRole('paragraph', {
      name: '',
    })

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
