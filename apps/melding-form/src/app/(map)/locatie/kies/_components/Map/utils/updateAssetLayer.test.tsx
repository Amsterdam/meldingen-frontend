import { act, renderHook, waitFor } from '@testing-library/react'
import L from 'leaflet'
import { Mock } from 'vitest'

import { addAssetLayerToMap } from './addAssetLayerToMap'
import { fetchAssets } from './fetchAssets'
import { useAssetLayer } from './updateAssetLayer'
import { containerAssets } from 'apps/melding-form/src/mocks/data'

const mapRef = { current: document.createElement('div') }

const map = new L.Map(mapRef.current, {
  center: L.latLng([52.370216, 4.895168]),
  zoom: 14,
  layers: [
    L.tileLayer('https://{s}.data.amsterdam.nl/topo_wm/{z}/{x}/{y}.png', {
      attribution: '',
      subdomains: ['t1', 't2', 't3', 't4'],
    }),
  ],
  zoomControl: false,
  maxZoom: 18,
  minZoom: 11,
  maxBounds: [
    [52.25168, 4.64034],
    [52.50536, 5.10737],
  ],
})

vi.mock('../utils/addAssetLayerToMap', () => ({
  addAssetLayerToMap: vi.fn(),
}))

vi.mock('../utils/fetchAssets', () => ({
  fetchAssets: vi.fn(),
}))

const mockSetAssetList = vi.fn()

describe.skip('useAssetLayer', () => {
  it('should not fetch assets if classification is not provided', () => {
    renderHook(() => useAssetLayer({ mapInstance: map, classification: undefined, setAssetList: mockSetAssetList }))

    expect(addAssetLayerToMap).not.toHaveBeenCalled()
    expect(fetchAssets).not.toHaveBeenCalled()
  })

  it('should not fetch assets if classification does not require assets', () => {
    renderHook(() => useAssetLayer({ mapInstance: map, classification: 'other', setAssetList: mockSetAssetList }))

    expect(addAssetLayerToMap).not.toHaveBeenCalled()
    expect(fetchAssets).not.toHaveBeenCalled()
  })

  it('should fetch assets when zoom level is above threshold and set assets', async () => {
    const classification = 'container'
    const ASSET_ZOOM_THRESHOLD = 16

    ;(fetchAssets as Mock).mockResolvedValue({ features: containerAssets })

    renderHook(() => useAssetLayer({ mapInstance: map, classification, setAssetList: mockSetAssetList }))

    act(() => {
      map.setZoom(ASSET_ZOOM_THRESHOLD)
      map.fire('moveend')
    })

    expect(fetchAssets).toHaveBeenCalledWith(map, classification)

    await waitFor(() => {
      expect(addAssetLayerToMap).toHaveBeenCalled()
      expect(mockSetAssetList).toHaveBeenCalledWith(containerAssets)
    })
  })

  it('should reset assetList when there are no assets', async () => {
    const classification = 'container'
    const ASSET_ZOOM_THRESHOLD = 16

    ;(fetchAssets as Mock).mockResolvedValue({ features: [] })

    renderHook(() => useAssetLayer({ mapInstance: map, classification, setAssetList: mockSetAssetList }))

    act(() => {
      map.setZoom(ASSET_ZOOM_THRESHOLD)
      map.fire('moveend')
    })

    expect(fetchAssets).toHaveBeenCalledWith(map, classification)

    await waitFor(() => {
      expect(addAssetLayerToMap).not.toHaveBeenCalled()
      expect(mockSetAssetList).toHaveBeenCalledWith([])
    })
  })
})
