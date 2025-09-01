import { renderHook } from '@testing-library/react'
import L from 'leaflet'

import { ASSET_ZOOM_THRESHOLD, type Props, useAssetLayer } from './useAssetLayer'
import { addAssetLayerToMap } from '../utils/addAssetLayerToMap'
import { fetchAssets } from '../utils/fetchAssets'
import { containerAssets } from 'apps/melding-form/src/mocks/data'

vi.mock('../utils/fetchAssets', () => ({
  fetchAssets: vi.fn(() => ({ features: containerAssets })),
}))
vi.mock('../utils/addAssetLayerToMap', () => ({
  addAssetLayerToMap: vi.fn(),
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
  describe('fetch assets', () => {
    it('does not fetch assets when mapInstance is null', async () => {
      renderHook(() => useAssetLayer({ ...defaultProps, mapInstance: null }))

      expect(fetchAssets).not.toHaveBeenCalled()
    })

    it('does not fetch assets when classification is undefined', async () => {
      renderHook(() => useAssetLayer({ ...defaultProps, classification: undefined }))

      expect(fetchAssets).not.toHaveBeenCalled()
    })
  })

  describe('add asset markers to map', () => {
    it('should call addAssetLayerToMap when there are assets in assetList', async () => {
      renderHook(() => useAssetLayer({ ...defaultProps, assetList: containerAssets }))

      expect(addAssetLayerToMap).toHaveBeenCalled()
    })
  })
})
