import type { GeoJsonObject } from 'geojson'
import L from 'leaflet'
import { MutableRefObject } from 'react'

import type { Feature } from '@meldingen/api-client'

import { getContainerFeatureIcon } from './getContainerFeatureIcon'
import { selectedAssetIcon } from '../markerIcons'
import { Coordinates } from 'apps/melding-form/src/types'

type Props = {
  assetLayerRef: MutableRefObject<L.Layer | null>
  assetList: Feature[]
  mapInstance: L.Map
  AssetMarkersRef: MutableRefObject<Record<string, L.Marker>>
  selectedAsset: Feature | null
  setCoordinates: (coordinates?: Coordinates) => void
  setSelectedAsset: (asset: Feature | null) => void
}

export const addAssetLayerToMap = ({
  assetLayerRef,
  assetList,
  mapInstance,
  AssetMarkersRef,
  selectedAsset,
  setCoordinates,
  setSelectedAsset,
}: Props) => {
  assetLayerRef.current?.remove()

  assetLayerRef.current = L.geoJSON(assetList as GeoJsonObject[], {
    pointToLayer: (feature, latlng) => {
      const isSelected = selectedAsset?.id === feature.id

      const marker = new L.Marker(latlng, {
        icon: isSelected ? selectedAssetIcon : getContainerFeatureIcon(feature),
        keyboard: false,
      })

      if (feature.id !== undefined) {
        AssetMarkersRef.current[feature.id] = marker
      }

      marker.on('click', () => {
        setSelectedAsset(feature as Feature)

        setCoordinates({
          lat: latlng.lat,
          lng: latlng.lng,
        })

        if (isSelected) {
          setCoordinates(undefined)
          setSelectedAsset(null)
        }
      })

      return marker
    },
  })

  assetLayerRef.current.addTo(mapInstance)
}
