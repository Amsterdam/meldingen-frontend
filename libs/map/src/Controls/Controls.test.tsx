import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Map } from 'leaflet'

import type { Props } from './Controls'

import { MapContext } from '../Map/Map'
import { Controls } from './Controls'

const INITIAL_ZOOM = 10

const mapInstanceMock = {
  getZoom: vi.fn().mockImplementation(() => INITIAL_ZOOM),
  setZoom: vi.fn(),
} as unknown as Map

const defaultTexts = {
  currentLocation: 'Mijn locatie',
  zoomIn: 'Inzoomen',
  zoomOut: 'Uitzoomen',
}

const defaultProps: Props = {
  onCurrentLocationError: vi.fn(),
  texts: defaultTexts,
  updateSelectedPoint: vi.fn(),
}

describe('Controls', () => {
  it('calls onCurrentLocationError on geolocation error', async () => {
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

    const mockOnCurrentLocationError = vi.fn()

    render(<Controls {...defaultProps} onCurrentLocationError={mockOnCurrentLocationError} />)

    const button = screen.getByRole('button', { name: defaultTexts.currentLocation })

    await user.click(button)

    expect(mockOnCurrentLocationError).toHaveBeenCalled()
  })

  it('calls updateSelectedPoint with the correct coordinates on geolocation success', async () => {
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

    const mockUpdateSelectedPoint = vi.fn()

    render(
      <MapContext.Provider value={mapInstanceMock}>
        <Controls {...defaultProps} updateSelectedPoint={mockUpdateSelectedPoint} />
      </MapContext.Provider>,
    )

    const button = screen.getByRole('button', { name: defaultTexts.currentLocation })

    await user.click(button)

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()

    expect(mockUpdateSelectedPoint).toHaveBeenCalledWith({
      lat: 52.370216,
      lng: 4.895168,
    })
  })

  it('does not call updateSelectedPoint when the map instance is not set', async () => {
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

    const mockUpdateSelectedPoint = vi.fn()

    render(
      <MapContext.Provider value={undefined}>
        <Controls {...defaultProps} updateSelectedPoint={mockUpdateSelectedPoint} />
      </MapContext.Provider>,
    )

    const button = screen.getByRole('button', { name: defaultTexts.currentLocation })

    await user.click(button)

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()

    expect(mockUpdateSelectedPoint).not.toHaveBeenCalled()
  })

  it('zooms in when zoom in controls are used', async () => {
    const user = userEvent.setup()

    render(
      <MapContext.Provider value={mapInstanceMock}>
        <Controls {...defaultProps} />
      </MapContext.Provider>,
    )

    const ZoomInButton = screen.getByRole('button', { name: 'Inzoomen' })

    await user.click(ZoomInButton)

    expect(mapInstanceMock.setZoom).toHaveBeenCalledWith(INITIAL_ZOOM + 1)
  })

  it('zooms out when zoom out controls are used', async () => {
    const user = userEvent.setup()

    render(
      <MapContext.Provider value={mapInstanceMock}>
        <Controls {...defaultProps} />
      </MapContext.Provider>,
    )

    const ZoomOutButton = screen.getByRole('button', { name: 'Uitzoomen' })

    await user.click(ZoomOutButton)

    expect(mapInstanceMock.setZoom).toHaveBeenCalledWith(INITIAL_ZOOM - 1)
  })
})
