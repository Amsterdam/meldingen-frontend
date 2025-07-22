import type { GeoJsonObject } from 'geojson'
import L from 'leaflet'
import { MutableRefObject } from 'react'

import type { Feature } from '@meldingen/api-client'

import { getFeatureIcon } from './getContainerFeatureIcon'

export const addAssetLayerToMap = (
  features: Feature[],
  assetLayerRef: MutableRefObject<L.Layer | null>,
  mapInstance: L.Map,
) => {
  assetLayerRef.current?.remove()

  assetLayerRef.current = L.geoJSON(features as GeoJsonObject[], {
    pointToLayer: (feature, latlng) => {
      const featureIcon = getFeatureIcon(feature)

      return new L.Marker(latlng, {
        icon: featureIcon,
      })
    },
  })

  assetLayerRef.current.addTo(mapInstance)
}
