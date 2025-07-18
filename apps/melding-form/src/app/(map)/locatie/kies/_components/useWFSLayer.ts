'use client'

import type { GeoJsonObject } from 'geojson'
import Cookies from 'js-cookie'
import L from 'leaflet'

import { getWfsByName } from '@meldingen/api-client'

import {
  gftAfvalIcon,
  glasAfvalIcon,
  papierAfvalIcon,
  plasticAfvalIcon,
  restAfvalIcon,
  textielAfvalIcon,
} from './map-markers'
import { handleApiError } from 'apps/melding-form/src/handleApiError'

const getFeatureIcon = (feature: any) => {
  const featureType = feature.properties.fractie_omschrijving

  switch (featureType) {
    case 'Papier': {
      return papierAfvalIcon
    }
    case 'Glas': {
      return glasAfvalIcon
    }
    case 'Rest': {
      return restAfvalIcon
    }
    case 'Textiel': {
      return textielAfvalIcon
    }
    case 'Plastic': {
      return plasticAfvalIcon
    }

    default:
      return gftAfvalIcon
  }
}

export const useWFSLayer = async (mapInstance: L.Map) => {
  const classification = Cookies.get('classification')
  const lowerCorner = mapInstance.getBounds().getSouthWest()
  const upperCorner = mapInstance.getBounds().getNorthEast()

  const filter = `<Filter>
  <And>
    <PropertyIsEqualTo>
      <PropertyName>status</PropertyName>
      <Literal>1</Literal>
    </PropertyIsEqualTo>

    <BBOX>
      <PropertyName>geometrie</PropertyName>
      <gml:Envelope srsName="EPSG:4326">
          <gml:lowerCorner>${lowerCorner.lng} ${lowerCorner.lat}</gml:lowerCorner>
          <gml:upperCorner>${upperCorner.lng} ${upperCorner.lat}</gml:upperCorner>
      </gml:Envelope>
    </BBOX>
  </And>
</Filter>
`

  const { data, response, error } = await getWfsByName({
    path: { name: classification },
    query: { filter },
  })

  if (response.ok && data?.features) {
    L.geoJSON(data.features as GeoJsonObject[], {
      pointToLayer: (feature, latlng) => {
        const featureIcon = getFeatureIcon(feature)

        return new L.Marker(latlng, {
          icon: featureIcon,
        })
      },
    }).addTo(mapInstance)
  }

  if (error) return { errorMessage: handleApiError(error) }
}
