import { render } from '@testing-library/react'
import { Map } from 'leaflet'
import { Mock, vi } from 'vitest'

import { MapComponent } from '../Map/Map'
import { FLY_TO_MIN_ZOOM, PointSelectLayer } from './PointSelectLayer'

const testCoords = { lat: 52.370216, lng: 4.895168 }

const mockMapInstance = {
  getCenter: vi.fn(() => testCoords),
  invalidateSize: vi.fn(),
  off: vi.fn(),
  on: vi.fn(),
  remove: vi.fn(),
} as unknown as Map

const defaultProps = {
  hideSelectedPoint: false,
  onSelectedPointChange: vi.fn(),
}

describe('PointSelectLayer', () => {
  it('renders Crosshair', () => {
    const { container } = render(<PointSelectLayer {...defaultProps} />)

    const crosshair = container.querySelector('#crosshair')

    expect(crosshair).toBeInTheDocument()
  })

  it('calls onSelectedPointChange when map is clicked', () => {
    const mockOnSelectedPointChange = vi.fn()

    render(
      <MapComponent testMapInstance={mockMapInstance}>
        <PointSelectLayer {...defaultProps} onSelectedPointChange={mockOnSelectedPointChange} />
      </MapComponent>,
    )

    // Mock the map click event
    ;(mockMapInstance.on as Mock).mock.calls.forEach((call) => {
      if (call[0] === 'click') {
        const mockEvent = { latlng: testCoords }
        call[1](mockEvent)
      }
    })

    expect(mockOnSelectedPointChange).toHaveBeenCalledWith(testCoords)
  })

  it('shows crosshair when using arrow key', () => {
    render(
      <MapComponent testMapInstance={mockMapInstance}>
        <PointSelectLayer {...defaultProps} />
      </MapComponent>,
    )

    // Simulate keydown event
    const event = {
      originalEvent: { key: 'ArrowLeft' },
    }

    // Mock the map keydown event
    ;(mockMapInstance.on as Mock).mock.calls.forEach((call) => {
      if (call[0] === 'keydown') {
        call[1](event)
      }
    })

    const crosshair = document.getElementById('crosshair')
    expect(crosshair?.style.display).toBe('block')
  })

  it('does not do anything on keydown when crosshair does not exist', () => {
    render(
      <MapComponent testMapInstance={undefined}>
        <PointSelectLayer {...defaultProps} />
      </MapComponent>,
    )

    const crosshair = document.getElementById('crosshair')

    if (crosshair) {
      crosshair.id = 'non-existing-crosshair'
    }

    // Simulate keydown event
    const event = {
      originalEvent: { key: 'ArrowLeft' },
    }

    // Mock the map keydown event
    ;(mockMapInstance.on as Mock).mock.calls.forEach((call) => {
      if (call[0] === 'keydown') {
        call[1](event)
      }
    })

    expect(crosshair?.style.display).not.toBe('block')
  })

  it('calls onSelectedPointChange with map center on space/enter', () => {
    const mockOnSelectedPointChange = vi.fn()

    render(
      <MapComponent testMapInstance={mockMapInstance}>
        <PointSelectLayer {...defaultProps} onSelectedPointChange={mockOnSelectedPointChange} />
      </MapComponent>,
    )

    // Simulate keydown event
    const spaceEvent = {
      originalEvent: { key: ' ' },
    }

    // Mock the map keydown event
    ;(mockMapInstance.on as Mock).mock.calls.forEach((call) => {
      if (call[0] === 'keydown') {
        call[1](spaceEvent)
      }
    })

    expect(mockOnSelectedPointChange).toHaveBeenCalledWith(testCoords)

    // Repeat for 'Enter' key
    const enterEvent = {
      originalEvent: { key: 'Enter' },
    }

    ;(mockMapInstance.on as Mock).mock.calls.forEach((call) => {
      if (call[0] === 'keydown') {
        call[1](enterEvent)
      }
    })

    expect(mockOnSelectedPointChange).toHaveBeenCalledWith(testCoords)
  })

  it('hides crosshair on map blur/mousemove/dragstart', () => {
    render(
      <MapComponent testMapInstance={mockMapInstance}>
        <PointSelectLayer {...defaultProps} />
      </MapComponent>,
    )

    const crosshair = document.getElementById('crosshair')

    // Mock the map blur event
    ;(mockMapInstance.on as Mock).mock.calls.forEach((call) => {
      if (call[0] === 'blur mousemove dragstart') {
        call[1]()
      }
    })

    expect(crosshair?.style.display).toBe('none')
  })

  it('adds a marker and flies to selectedPoint when provided', () => {
    const mockAddLayer = vi.fn()
    const mockFlyTo = vi.fn()
    const currentZoom = FLY_TO_MIN_ZOOM + 1

    render(
      <MapComponent
        testMapInstance={
          {
            ...mockMapInstance,
            addLayer: mockAddLayer,
            flyTo: mockFlyTo,
            getZoom: vi.fn(() => currentZoom),
          } as unknown as Map
        }
      >
        <PointSelectLayer {...defaultProps} selectedPoint={testCoords} />
      </MapComponent>,
    )

    expect(mockAddLayer).toHaveBeenCalledWith(expect.objectContaining({ _latlng: testCoords }))
    expect(mockFlyTo).toHaveBeenCalledWith([testCoords.lat, testCoords.lng], currentZoom)
  })

  it('flies to a minimum zoom level when selectedPoint is provided and current zoom is too low', () => {
    const mockFlyTo = vi.fn()
    const currentZoom = FLY_TO_MIN_ZOOM - 1

    render(
      <MapComponent
        testMapInstance={
          {
            ...mockMapInstance,
            addLayer: vi.fn(),
            flyTo: mockFlyTo,
            getZoom: vi.fn(() => currentZoom),
          } as unknown as Map
        }
      >
        <PointSelectLayer {...defaultProps} selectedPoint={testCoords} />
      </MapComponent>,
    )

    expect(mockFlyTo).toHaveBeenCalledWith([testCoords.lat, testCoords.lng], FLY_TO_MIN_ZOOM)
  })

  it('does not add a marker when hideSelectedPoint is true', () => {
    const mockAddLayer = vi.fn()

    render(
      <MapComponent
        testMapInstance={
          {
            ...mockMapInstance,
            addLayer: mockAddLayer,
            flyTo: vi.fn(),
            getZoom: vi.fn(() => FLY_TO_MIN_ZOOM),
          } as unknown as Map
        }
      >
        <PointSelectLayer {...defaultProps} hideSelectedPoint={true} selectedPoint={testCoords} />
      </MapComponent>,
    )

    expect(mockAddLayer).not.toHaveBeenCalled()
  })

  it('only flies to selectedPoint on initial load when hideSelectedPoint is true', () => {
    const mockFlyTo = vi.fn()

    const { rerender } = render(
      <MapComponent
        testMapInstance={
          {
            ...mockMapInstance,
            flyTo: mockFlyTo,
            getZoom: vi.fn(() => FLY_TO_MIN_ZOOM),
          } as unknown as Map
        }
      >
        <PointSelectLayer {...defaultProps} hideSelectedPoint={true} selectedPoint={testCoords} />
      </MapComponent>,
    )

    // Initial load - should fly to selectedPoint
    expect(mockFlyTo).toHaveBeenCalledWith([testCoords.lat, testCoords.lng], FLY_TO_MIN_ZOOM)

    mockFlyTo.mockClear()

    // Rerender with a different selectedPoint - should NOT fly to it
    const newCoords = { lat: 52.3, lng: 4.9 }
    rerender(
      <MapComponent
        testMapInstance={
          {
            ...mockMapInstance,
            flyTo: mockFlyTo,
            getZoom: vi.fn(() => FLY_TO_MIN_ZOOM),
          } as unknown as Map
        }
      >
        <PointSelectLayer {...defaultProps} hideSelectedPoint={true} selectedPoint={newCoords} />
      </MapComponent>,
    )

    expect(mockFlyTo).not.toHaveBeenCalled()
  })
})
