import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import { SideBar } from './SideBar'
import { ENDPOINTS } from 'apps/public/src/mocks/endpoints'
import { server } from 'apps/public/src/mocks/node'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

describe('SideBar', () => {
  it('should render correctly', () => {
    render(<SideBar setCoordinates={() => {}} />)

    const heading = screen.getByRole('heading', { name: 'title' })
    const description = screen.getAllByText('description')

    expect(heading).toBeInTheDocument()
    expect(description[0]).toBeInTheDocument()
  })

  it('should show an address based on provided coordinates ', async () => {
    render(<SideBar coordinates={{ lat: 52.37239126063553, lng: 4.900905743712159 }} setCoordinates={() => {}} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Nieuwmarkt 15, 1011JR Amsterdam')).toBeInTheDocument()
    })
  })

  it('should show a generic label if no address is found within 30 meters of the coordinates', async () => {
    server.use(
      http.get(ENDPOINTS.PDOK_REVERSE, () =>
        HttpResponse.json({
          response: {
            numFound: 0,
            docs: [],
          },
        }),
      ),
    )

    render(<SideBar coordinates={{ lat: 52.37239126063553, lng: 4.900905743712159 }} setCoordinates={() => {}} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('combo-box.no-address')).toBeInTheDocument()
    })
  })
})
