import L from 'leaflet'
import { MutableRefObject } from 'react'

import type { Feature } from '@meldingen/api-client'

import { type Props, updateAssetMarkers } from './updateAssetMarkers'

vi.mock('../markerIcons', () => ({
  selectedAssetsIcon: { icon: 'selected' },
}))

vi.mock('./getContainerFeatureIcon', () => ({
  getContainerFeatureIcon: vi.fn((_feature, isSelected) => ({ icon: `container${isSelected ? '-selected' : ''}` })),
}))

const defaultProps: Props = {
  mapInstance: {} as unknown as L.Map,
  assetMarkersRef: {
    current: {
      '1': {
        setIcon: vi.fn(),
        feature: { id: '1', type: 'Feature' },
      },
      '2': {
        setIcon: vi.fn(),
        feature: { id: '2', type: 'Feature' },
      },
    },
  } as unknown as MutableRefObject<Record<string, L.Marker>>,
  selectedAssets: [{ id: '1', type: 'Feature' }] as Feature[],
}

describe('updateAssetMarkers', () => {
  it('does not update markers if mapInstance is null', () => {
    const result = updateAssetMarkers({ ...defaultProps, mapInstance: null })

    expect(result).toBeUndefined()
  })

  it('does not update markers if assetMarkersRef is empty', () => {
    const result = updateAssetMarkers({ ...defaultProps, assetMarkersRef: { current: {} } })

    expect(result).toBeUndefined()
  })

  it('sets selectedAssetsIcon for selected assets', () => {
    updateAssetMarkers(defaultProps)

    expect(defaultProps.assetMarkersRef.current['1'].setIcon).toHaveBeenCalledWith({ icon: 'container-selected' })
  })

  it('sets container icon for unselected assets', () => {
    updateAssetMarkers(defaultProps)

    expect(defaultProps.assetMarkersRef.current['2'].setIcon).toHaveBeenCalledWith({ icon: 'container' })
  })
})
