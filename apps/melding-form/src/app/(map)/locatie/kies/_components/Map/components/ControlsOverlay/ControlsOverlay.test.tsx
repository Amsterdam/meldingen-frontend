import { AlertProps } from '@amsterdam/design-system-react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type L from 'leaflet'

import { ControlsOverlay, type Props } from './ControlsOverlay'

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

const defaultProps: Props = {
  mapInstance: mapInstanceMock,
  setCoordinates: vi.fn(),
  notification: null,
  setNotification: vi.fn(),
}

const mockNotification = {
  closeButtonLabel: 'my-location-notification.close-button',
  description: 'my-location-notification.description',
  heading: 'my-location-notification.title',
  severity: 'error' as AlertProps['severity'],
}

describe('ControlsOverlay', () => {
  it('sets a notification on geolocation error', async () => {
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

    render(<ControlsOverlay {...defaultProps} />)

    const button = screen.getByRole('button', { name: 'current-location-button' })

    await user.click(button)

    expect(defaultProps.setNotification).toHaveBeenCalledWith(mockNotification)
  })

  it('closes the notification when the close button is clicked', async () => {
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

    render(<ControlsOverlay {...defaultProps} notification={mockNotification} />)

    const closeButton = screen.getByRole('button', { name: 'my-location-notification.close-button' })

    await user.click(closeButton)

    expect(defaultProps.setNotification).toHaveBeenCalledWith(null)
  })

  it('calls setCoordinates with the correct coordinates on geolocation success', async () => {
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

    render(<ControlsOverlay {...defaultProps} />)

    const button = screen.getByRole('button', { name: 'current-location-button' })

    await user.click(button)

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()

    expect(defaultProps.setCoordinates).toHaveBeenCalledWith({
      lat: 52.370216,
      lng: 4.895168,
    })
  })

  it('return undefined onSuccess when mapInstance is not set', async () => {
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

    render(<ControlsOverlay {...defaultProps} mapInstance={null} />)

    const button = screen.getByRole('button', { name: 'current-location-button' })

    await user.click(button)

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()

    expect(defaultProps.setCoordinates).not.toHaveBeenCalled()
  })

  it('should zoom in when zoom controls are used', async () => {
    const user = userEvent.setup()

    render(<ControlsOverlay {...defaultProps} />)

    const ZoomInButton = screen.getByRole('button', { name: 'zoom-in' })

    await user.click(ZoomInButton)

    expect(mapInstanceMock.setZoom).toHaveBeenCalledWith(INITIAL_ZOOM + 1)
  })

  it('should zoom out when zoom controls are used', async () => {
    const user = userEvent.setup()

    render(<ControlsOverlay {...defaultProps} />)

    const ZoomOutButton = screen.getByRole('button', { name: 'zoom-out' })

    await user.click(ZoomOutButton)

    expect(mapInstanceMock.setZoom).toHaveBeenCalledWith(INITIAL_ZOOM - 1)
  })
})
