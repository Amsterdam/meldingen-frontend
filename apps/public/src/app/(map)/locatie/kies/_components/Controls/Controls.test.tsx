import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import leaflet from 'leaflet'
import { vi } from 'vitest'

import { Controls } from './Controls'
import { marker } from '../Marker/Marker'
import L from 'leaflet'

const INITIAL_ZOOM = 10

const mapMock = {
  center: [52.370216, 4.895168],
  zoom: 14,
  layers: [],
  maxZoom: 18,
  minZoom: 11,
  maxBounds: [
    [52.25168, 4.64034],
    [52.50536, 5.10737],
  ],
  getZoom: vi.fn().mockImplementation(() => INITIAL_ZOOM),
  setZoom: vi.fn(),
} as unknown as L.Map

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

describe('Controls', () => {
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

    render(<Controls mapInstance={mapMock} />)

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

    render(<Controls mapInstance={mapMock} />)

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

  it('should zoom in and out when zoom controls are used', async () => {
    const user = userEvent.setup()

    render(<Controls mapInstance={mapMock} />)

    const ZoomInButton = screen.getByRole('button', { name: 'Inzoomen' })

    await user.click(ZoomInButton)

    expect(mapMock.setZoom).toHaveBeenCalledWith(INITIAL_ZOOM + 1)

    const ZoomOutButton = screen.getByRole('button', { name: 'Uitzoomen' })

    await user.click(ZoomOutButton)

    expect(mapMock.setZoom).toHaveBeenCalledWith(INITIAL_ZOOM - 1)
  })
})
