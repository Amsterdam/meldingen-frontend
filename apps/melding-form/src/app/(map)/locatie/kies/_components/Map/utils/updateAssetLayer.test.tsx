import L from 'leaflet'
import { MutableRefObject } from 'react'
import { Mock } from 'vitest'

import { addAssetLayerToMap } from './addAssetLayerToMap'
import { fetchAssets } from './fetchAssets'
import { updateAssetLayer } from './useAssetLayer'
import { containerAssets } from 'apps/melding-form/src/mocks/data'

vi.mock('./fetchAssets', () => ({
  fetchAssets: vi.fn(() => ({ features: containerAssets })),
}))

vi.mock('./addAssetLayerToMap', () => ({
  addAssetLayerToMap: vi.fn(),
}))

const INITIAL_ZOOM = 16

const mapInstanceMock = {
  getZoom: vi.fn().mockImplementation(() => INITIAL_ZOOM),
  getSize: vi.fn(() => ({ x: 800, y: 600 })),
} as unknown as L.Map

const mockDefaultValues = {
  assetLayerRef: { current: null } as MutableRefObject<L.Layer | null>,
  classification: 'container',
  mapInstance: mapInstanceMock,
  setAssetList: vi.fn(),
}

describe('updateAssetLayer', () => {
  it('should early return when classification does not have assets or has display none', async () => {
    const result = await updateAssetLayer({ ...mockDefaultValues, classification: 'other' })

    expect(result).toBeUndefined()
    expect(mockDefaultValues.setAssetList).not.toHaveBeenCalled()
    expect(addAssetLayerToMap).not.toHaveBeenCalled()
  })

  it('should fetch assets when zoom treshold is met and call addAssetLayerToMap and setAssetList when there are features ', async () => {
    await updateAssetLayer(mockDefaultValues)

    expect(fetchAssets).toHaveBeenCalledWith(mapInstanceMock, mockDefaultValues.classification)
    expect(mockDefaultValues.setAssetList).toHaveBeenCalledWith(containerAssets)
    expect(addAssetLayerToMap).toHaveBeenCalledWith(containerAssets, mockDefaultValues.assetLayerRef, mapInstanceMock)
  })

  it('should reset assetList when there are no features', async () => {
    ;(fetchAssets as Mock).mockResolvedValueOnce({ features: [] })
    await updateAssetLayer(mockDefaultValues)

    expect(mockDefaultValues.setAssetList).toHaveBeenCalledWith([])
  })

  it('should reset assetList and remove layer when zoom threshold is not met', async () => {
    mockDefaultValues.mapInstance.getZoom = vi.fn().mockReturnValue(INITIAL_ZOOM - 1)
    const mockAssetLayerRef = { current: { remove: vi.fn() } } as unknown as MutableRefObject<L.Layer | null>

    await updateAssetLayer({ ...mockDefaultValues, assetLayerRef: mockAssetLayerRef })

    expect(mockDefaultValues.setAssetList).toHaveBeenCalledWith([])
    expect(mockAssetLayerRef.current?.remove).toHaveBeenCalled()
  })
})
