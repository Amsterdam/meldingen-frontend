import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import L from 'leaflet'
import { vi } from 'vitest'

import { marker } from '../Marker/Marker'

import { ControlsOverlay } from './ControlsOverlay'

const INITIAL_ZOOM = 10

const mapInstanceMock = {
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

describe('ControlsOverlay', () => {
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

    render(<ControlsOverlay hideListView mapInstance={mapInstanceMock} />)

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

    render(<ControlsOverlay hideListView mapInstance={mapInstanceMock} />)

    const button = screen.getByRole('button', { name: 'Mijn locatie' })

    await user.click(button)

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()

    await waitFor(() => {
      expect(L.marker).toHaveBeenCalledWith(
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

  it('should zoom in when zoom controls are used', async () => {
    const user = userEvent.setup()

    render(<ControlsOverlay hideListView mapInstance={mapInstanceMock} />)

    const ZoomInButton = screen.getByRole('button', { name: 'Inzoomen' })

    await user.click(ZoomInButton)

    expect(mapInstanceMock.setZoom).toHaveBeenCalledWith(INITIAL_ZOOM + 1)
  })

  it('should zoom out when zoom controls are used', async () => {
    const user = userEvent.setup()

    render(<ControlsOverlay hideListView mapInstance={mapInstanceMock} />)

    const ZoomOutButton = screen.getByRole('button', { name: 'Uitzoomen' })

    await user.click(ZoomOutButton)

    expect(mapInstanceMock.setZoom).toHaveBeenCalledWith(INITIAL_ZOOM - 1)
  })
})
