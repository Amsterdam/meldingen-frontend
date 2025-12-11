import { render, waitFor } from '@testing-library/react'
import { Map } from 'leaflet'
import { Mock, vi } from 'vitest'

import { MapComponent } from '../Map/Map'
import { MarkerSelectLayer, Props } from './MarkerSelectLayer'

const defaultProps: Props = {
  features: [],
  maxMarkers: 5,
  onFeaturesChange: vi.fn(),
  onMaxMarkersReached: vi.fn(),
  onSelectedMarkersChange: vi.fn(),
  selectedMarkers: [],
  updateSelectedPoint: vi.fn(),
}

const mockMapInstance = {
  getBounds: vi.fn(() => ({
    getNorthEast: vi.fn(() => ({ lat: 52.3792, lng: 4.911 })),
    getSouthWest: vi.fn(() => ({ lat: 52.3676, lng: 4.9041 })),
  })),
  getSize: vi.fn(() => ({ x: 800, y: 600 })),
  getZoom: vi.fn(() => 420),
  invalidateSize: vi.fn(),
  off: vi.fn(),
  on: vi.fn(),
  remove: vi.fn(),
} as unknown as Map

vi.mock('@meldingen/api-client', () => ({
  getWfsByName: vi.fn().mockResolvedValue({ data: { features: ['Test feature'] }, error: undefined }),
}))

describe('MarkerSelectLayer', () => {
  it('returns undefined', () => {
    const { container } = render(<MarkerSelectLayer {...defaultProps} />)

    expect(container.firstChild).toBeNull()
  })

  it('does not fetch assets if classification is undefined', async () => {
    render(
      <MapComponent testMapInstance={mockMapInstance}>
        <MarkerSelectLayer {...defaultProps} classification={undefined} />
      </MapComponent>,
    )

    // Mock the map moveend event
    ;(mockMapInstance.on as Mock).mock.calls.forEach((call) => {
      if (call[0] === 'moveend') {
        call[1]()
      }
    })

    // Use the call to getSize to ensure the async operations complete
    await waitFor(() => {
      expect(mockMapInstance.getSize()).not.toBeUndefined()
    })

    expect(defaultProps.onFeaturesChange).not.toHaveBeenCalled()
  })

  it('does not fetch assets if classification has no asset support', async () => {
    render(
      <MapComponent testMapInstance={mockMapInstance}>
        <MarkerSelectLayer {...defaultProps} classification="invalid-classification" />
      </MapComponent>,
    )

    // Mock the map moveend event
    ;(mockMapInstance.on as Mock).mock.calls.forEach((call) => {
      if (call[0] === 'moveend') {
        call[1]()
      }
    })

    // Use the call to getSize to ensure the async operations complete
    await waitFor(() => {
      expect(mockMapInstance.getSize()).not.toBeUndefined()
    })

    expect(defaultProps.onFeaturesChange).not.toHaveBeenCalled()
  })

  it('does not fetch assets if map is hidden', async () => {
    const mockMapInstanceHidden = {
      ...mockMapInstance,
      getSize: vi.fn(() => ({ x: 0, y: 0 })),
    } as unknown as Map

    render(
      <MapComponent testMapInstance={mockMapInstanceHidden}>
        <MarkerSelectLayer {...defaultProps} classification="container" />
      </MapComponent>,
    )

    // Mock the map moveend event
    ;(mockMapInstance.on as Mock).mock.calls.forEach((call) => {
      if (call[0] === 'moveend') {
        call[1]()
      }
    })

    // Use the call to getSize to ensure the async operations complete
    await waitFor(() => {
      expect(mockMapInstanceHidden.getSize()).not.toBeUndefined()
    })

    expect(defaultProps.onFeaturesChange).not.toHaveBeenCalled()
  })

  it('calls onFeaturesChange with fetched assets', async () => {
    render(
      <MapComponent testMapInstance={mockMapInstance}>
        <MarkerSelectLayer {...defaultProps} classification="container" />
      </MapComponent>,
    )

    // Mock the map moveend event
    ;(mockMapInstance.on as Mock).mock.calls.forEach((call) => {
      if (call[0] === 'moveend') {
        call[1]()
      }
    })

    // Use the call to getSize to ensure the async operations complete
    await waitFor(() => {
      expect(mockMapInstance.getSize()).not.toBeUndefined()
    })

    expect(defaultProps.onFeaturesChange).toHaveBeenCalledWith(['Test feature'])
  })
})
