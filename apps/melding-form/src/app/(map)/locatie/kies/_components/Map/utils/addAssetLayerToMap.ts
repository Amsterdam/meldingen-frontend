import type { GeoJsonObject } from 'geojson'
import L from 'leaflet'
import { Dispatch, MutableRefObject, SetStateAction } from 'react'

import type { Feature } from '@meldingen/api-client'

import { getContainerFeatureIcon } from './getContainerFeatureIcon'
import { selectedAssetsIcon } from '../markerIcons'
import { Coordinates } from 'apps/melding-form/src/types'

const MAX_ASSETS = 5

export type Props = {
  assetLayerRef: MutableRefObject<L.Layer | null>
  assetList: Feature[]
  mapInstance: L.Map
  AssetMarkersRef: MutableRefObject<Record<string, L.Marker>>
  selectedAssets: Feature[]
  setCoordinates: (coordinates?: Coordinates) => void
  setSelectedAssets: Dispatch<SetStateAction<Feature[]>>
}

export const addAssetLayerToMap = ({
  assetLayerRef,
  assetList,
  mapInstance,
  AssetMarkersRef,
  selectedAssets,
  setCoordinates,
  setSelectedAssets,
}: Props) => {
  assetLayerRef.current?.remove()

  assetLayerRef.current = L.geoJSON(assetList as GeoJsonObject[], {
    pointToLayer: (feature, latlng) => {
      const isSelected = selectedAssets.some((a) => a.id === feature.id)

      const marker = new L.Marker(latlng, {
        icon: isSelected ? selectedAssetsIcon : getContainerFeatureIcon(feature),
        keyboard: false,
      })

      if (feature.id !== undefined) {
        AssetMarkersRef.current[feature.id] = marker
      }

      marker.on('click', () => {
        if (!isSelected) {
          // TODO: show some kind of message that max assets is reached
          if (selectedAssets.length >= MAX_ASSETS) return

          setSelectedAssets((selectedList) => [...selectedList, feature as Feature])
          setCoordinates({
            lat: latlng.lat,
            lng: latlng.lng,
          })
        }

        if (isSelected) {
          setSelectedAssets((selectedList) => selectedList.filter((a) => a.id !== feature.id))
          setCoordinates(undefined)
        }
      })

      return marker
    },
  })

  assetLayerRef.current.addTo(mapInstance)
}
