import L from 'leaflet'
import { MutableRefObject } from 'react'

import { Feature } from '@meldingen/api-client'

import { selectedAssetsIcon } from '../markerIcons'
import { getContainerFeatureIcon } from '../utils/getContainerFeatureIcon'

export type Props = {
  mapInstance: L.Map | null
  AssetMarkersRef: MutableRefObject<Record<string, L.Marker>>
  selectedAssets: Feature[]
}

export const updateAssetMarkers = ({ mapInstance, AssetMarkersRef, selectedAssets }: Props) => {
  if (!mapInstance || Object.keys(AssetMarkersRef.current).length === 0) return

  Object.entries(AssetMarkersRef.current).forEach(([id, marker]) => {
    const isSelected = selectedAssets.some((asset) => asset.id === id)

    if (isSelected) {
      marker.setIcon(selectedAssetsIcon)
    } else if (marker.feature) {
      marker.setIcon(getContainerFeatureIcon(marker.feature))
    }
  })
}
