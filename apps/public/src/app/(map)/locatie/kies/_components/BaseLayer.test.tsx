import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import leaflet from 'leaflet'
import { vi } from 'vitest'

import { BaseLayer } from './BaseLayer'
import { marker } from './Marker/Marker'

vi.mock('leaflet', async (importOriginal) => {
  const actual = await importOriginal()

  const markerMock = {
    addTo: vi.fn(),
  }

  return {
    default: {
      ...(typeof actual === 'object' ? actual : {}),
      marker: vi.fn(() => markerMock),
    },
  }
})

describe('BaseLayer', () => {
  it('renders the component', () => {
    const { container } = render(<BaseLayer setCoordinates={() => {}} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders the current location button', () => {
    render(<BaseLayer setCoordinates={() => {}} />)

    const button = screen.getByRole('button', { name: 'Mijn locatie' })

    expect(button).toBeInTheDocument()
  })

  it('displays a notification on geolocation error', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementationOnce((_, error) =>
        error({
          code: 1,
          message: 'User denied Geolocation',
        }),
      ),
    }

    // @ts-expect-error: This isn't a problem in tests
    global.navigator.geolocation = mockGeolocation

    const user = userEvent.setup()

    render(<BaseLayer setCoordinates={() => {}} />)

    const button = screen.getByRole('button', { name: 'Mijn locatie' })

    await user.click(button)

    const notification = screen.getByRole('heading', {
      name: 'meldingen.amsterdam.nl heeft geen toestemming om uw locatie te gebruiken.',
    })

    expect(notification).toBeInTheDocument()
  })

  it('adds a marker on geolocation success', async () => {
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementationOnce((success) =>
        success({
          coords: {
            latitude: 52.370216,
            longitude: 4.895168,
          },
        }),
      ),
    }

    // @ts-expect-error: This isn't a problem in tests
    global.navigator.geolocation = mockGeolocation

    const user = userEvent.setup()

    render(<BaseLayer setCoordinates={() => {}} />)

    const button = screen.getByRole('button', { name: 'Mijn locatie' })

    await user.click(button)

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()

    await waitFor(() => {
      expect(leaflet.marker).toHaveBeenCalledWith(
        {
          lat: 52.370216,
          lng: 4.895168,
        },
        {
          icon: marker,
        },
      )
    })
  })
})
