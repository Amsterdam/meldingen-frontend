import L from 'leaflet'
import { MutableRefObject } from 'react'

import type { Feature } from '@meldingen/api-client'

import { type Props, updateAssetMarkers } from './updateAssetMarkers'
import { selectedAssetsIcon } from '../markerIcons'

vi.mock('../markerIcons', () => ({
  selectedAssetsIcon: { icon: 'selected' },
}))

vi.mock('../utils/getContainerFeatureIcon', () => ({
  getContainerFeatureIcon: vi.fn(() => ({ icon: 'container' })),
}))

const defaultProps: Props = {
  mapInstance: {} as unknown as L.Map,
  AssetMarkersRef: {
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
  it('should not update markers if mapInstance is null', () => {
    const result = updateAssetMarkers({ ...defaultProps, mapInstance: null })

    expect(result).toBeUndefined()
  })

  it('should not update markers if AssetMarkersRef is empty', () => {
    const result = updateAssetMarkers({ ...defaultProps, AssetMarkersRef: { current: {} } })

    expect(result).toBeUndefined()
  })

  it('should set selectedAssetsIcon for selected assets', () => {
    updateAssetMarkers(defaultProps)

    expect(defaultProps.AssetMarkersRef.current['1'].setIcon).toHaveBeenCalledWith(selectedAssetsIcon)
  })

  it('should set container icon for unselected assets', () => {
    updateAssetMarkers(defaultProps)

    expect(defaultProps.AssetMarkersRef.current['2'].setIcon).toHaveBeenCalledWith({ icon: 'container' })
  })
})
