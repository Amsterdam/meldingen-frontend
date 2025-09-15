import type { GeoJsonObject } from 'geojson'
import L from 'leaflet'
import { Dispatch, MutableRefObject, SetStateAction } from 'react'

import type { Feature } from '@meldingen/api-client'

import { getContainerFeatureIcon } from './getContainerFeatureIcon'
import { NotificationType } from '../types'
import { Coordinates } from 'apps/melding-form/src/types'

export const MAX_ASSETS = 5

type TranslationFunction = (key: string, values?: Record<string, string | number | Date> | undefined) => string

export type Props = {
  assetLayerRef: MutableRefObject<L.Layer | null>
  assetList: Feature[]
  assetMarkersRef: MutableRefObject<Record<string, L.Marker>>
  mapInstance?: L.Map | null
  notification: NotificationType | null
  selectedAssets: Feature[]
  setCoordinates: (coordinates?: Coordinates) => void
  setNotification: (notification: NotificationType | null) => void
  setSelectedAssets: Dispatch<SetStateAction<Feature[]>>
  t: TranslationFunction
}

export const addAssetLayerToMap = ({
  assetLayerRef,
  assetList,
  assetMarkersRef,
  mapInstance,
  notification,
  selectedAssets,
  setCoordinates,
  setNotification,
  setSelectedAssets,
  t,
}: Props) => {
  if (!mapInstance || assetList.length === 0) return

  assetLayerRef.current?.remove()

  assetLayerRef.current = L.geoJSON(assetList as GeoJsonObject[], {
    pointToLayer: (feature, latlng) => {
      const isSelected = selectedAssets.some((a) => a.id === feature.id)

      const marker = new L.Marker(latlng, {
        icon: getContainerFeatureIcon(feature, isSelected),
        keyboard: false,
      })

      if (feature.id !== undefined) {
        assetMarkersRef.current[feature.id] = marker
      }

      marker.on('click', () => {
        if (!isSelected) {
          if (selectedAssets.length >= MAX_ASSETS) {
            setNotification({
              closeButtonLabel: t('max-asset-notification.close-button'),
              heading: t('max-asset-notification.title', { maxAssets: MAX_ASSETS }),
            })
            return
          }

          setSelectedAssets((selectedList) => [...selectedList, feature as Feature])
          setCoordinates({
            lat: latlng.lat,
            lng: latlng.lng,
          })
        }

        if (isSelected) {
          if (notification) {
            setNotification(null)
          }

          setSelectedAssets((selectedList) => selectedList.filter((a) => a.id !== feature.id))
          setCoordinates(undefined)
        }
      })

      return marker
    },
  })

  assetLayerRef.current.addTo(mapInstance)
}
