'use client'

import { GeoJsonObject } from 'geojson'
import L from 'leaflet'
import { useEffect } from 'react'

import { getWfsByName } from '@meldingen/api-client'

import { getFeatureIcon } from './utils'
import { handleApiError } from 'apps/melding-form/src/handleApiError'

const classificationsWithAssets = ['container']

const ASSET_ZOOM_THRESHOLD = 16

export const useWFSLayer = (mapInstance: L.Map | null, classification?: string) => {
  let assetLayer: L.GeoJSON | null

  if (!classification || !classificationsWithAssets.includes(classification)) return

  const fetchAndRenderAssets = async (mapInstance: L.Map) => {
    const lowerCorner = mapInstance.getBounds().getSouthWest()
    const upperCorner = mapInstance.getBounds().getNorthEast()

    const filter = `
    <Filter>
      <And>
        <PropertyIsEqualTo>
          <PropertyName>status</PropertyName>
          <Literal>1</Literal>
        </PropertyIsEqualTo>
      
        <BBOX>
          <gml:Envelope srsName="EPSG:4326">
              <gml:lowerCorner>${lowerCorner.lng} ${lowerCorner.lat}</gml:lowerCorner>
              <gml:upperCorner>${upperCorner.lng} ${upperCorner.lat}</gml:upperCorner>
          </gml:Envelope>
        </BBOX>
      </And>
    </Filter>
  `

    const { data, error } = await getWfsByName({
      path: { name: classification },
      query: { filter },
    })

    if (data?.features) {
      assetLayer?.remove()

      assetLayer = L.geoJSON(data.features as GeoJsonObject[], {
        pointToLayer: (feature, latlng) => {
          const featureIcon = getFeatureIcon(feature)

          return new L.Marker(latlng, {
            icon: featureIcon,
          })
        },
      })

      assetLayer.addTo(mapInstance)
    }

    if (error) throw new Error(handleApiError(error))
  }

  const onMoveEnd = () => {
    if (!mapInstance) return
    const zoom = mapInstance.getZoom()

    // Has correct zoom level for assets
    if (zoom >= ASSET_ZOOM_THRESHOLD) {
      fetchAndRenderAssets(mapInstance)
    } else if (zoom < ASSET_ZOOM_THRESHOLD && assetLayer) {
      assetLayer.remove()
    }
  }

  useEffect(() => {
    mapInstance?.on('moveend', onMoveEnd)

    return () => {
      mapInstance?.off('moveend', onMoveEnd)
    }
  }, [mapInstance])
}
