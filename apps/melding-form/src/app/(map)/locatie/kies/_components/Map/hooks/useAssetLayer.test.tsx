import { renderHook } from '@testing-library/react'
import L from 'leaflet'
import { Mock } from 'vitest'

import { type Props, useAssetLayer } from './useAssetLayer'
import { addAssetLayerToMap } from '../utils/addAssetLayerToMap'
import { ASSET_ZOOM_THRESHOLD, fetchAssets } from '../utils/fetchAssets'
import { updateAssetMarkers } from '../utils/updateAssetMarkers'
import { containerAssets } from 'apps/melding-form/src/mocks/data'

vi.mock('../utils/fetchAssets', () => ({
  fetchAssets: vi.fn(() => ({ features: containerAssets })),
}))
vi.mock('../utils/addAssetLayerToMap', () => ({
  addAssetLayerToMap: vi.fn(),
}))

vi.mock('../utils/updateAssetMarkers', () => ({
  updateAssetMarkers: vi.fn(),
}))

const mapInstanceMock = {
  getZoom: vi.fn().mockImplementation(() => ASSET_ZOOM_THRESHOLD),
  on: vi.fn(),
} as unknown as L.Map

const defaultProps: Props = {
  assetList: [],
  classification: 'container',
  mapInstance: mapInstanceMock,
  selectedAssets: [],
  setAssetList: vi.fn(),
  setCoordinates: vi.fn(),
  setSelectedAssets: vi.fn(),
}

describe('useAssetLayer', () => {
  it('calls fetchAssets on moveend', () => {
    renderHook(() => useAssetLayer(defaultProps))

    expect(mapInstanceMock.on).toHaveBeenCalledWith('moveend', expect.any(Function))

    const moveendCallback = (mapInstanceMock.on as Mock).mock.calls[0][1]
    moveendCallback()

    expect(fetchAssets).toHaveBeenCalledWith({
      mapInstance: mapInstanceMock,
      classification: 'container',
      setAssetList: defaultProps.setAssetList,
      assetLayerRef: expect.any(Object),
    })
  })

  it('calls addAssetLayerToMap when there are assets in assetList', async () => {
    renderHook(() => useAssetLayer({ ...defaultProps, assetList: containerAssets }))

    expect(addAssetLayerToMap).toHaveBeenCalled()
  })

  it('calls updateAssetMarkers when selectedAssets are present', async () => {
    renderHook(() => useAssetLayer({ ...defaultProps, selectedAssets: [containerAssets[0]] }))

    expect(updateAssetMarkers).toHaveBeenCalledWith({
      mapInstance: mapInstanceMock,
      assetMarkersRef: { current: {} },
      selectedAssets: [containerAssets[0]],
    })
  })
})
