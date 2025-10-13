import L from 'leaflet'
import 'leaflet.markercluster'
import { Dispatch, RefObject, SetStateAction } from 'react'

import type { Feature } from '@meldingen/api-client'

import { AssetFeature, getContainerFeatureIcon } from './getContainerFeatureIcon'
import { NotificationType } from '../types'
import { Coordinates } from 'apps/melding-form/src/types'

import './cluster.css'

export const MAX_ASSETS = 5

type TranslationFunction = (key: string, values?: Record<string, string | number | Date> | undefined) => string

export type Props = {
  assetLayerRef: RefObject<L.Layer | null>
  assetList: Feature[]
  assetMarkersRef: RefObject<Record<string, L.Marker>>
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

  const markerClusterGroup = L.markerClusterGroup({
    iconCreateFunction: (cluster) => {
      // Cluster markers should not be keyboard accessible
      cluster.options.keyboard = false

      return L.divIcon({
        html: cluster.getChildCount().toString(),
        className: 'meldingen-cluster',
        iconSize: [70, 70],
        iconAnchor: [35, 35],
      })
    },
    showCoverageOnHover: false,
  }) as L.MarkerClusterGroup

  assetList.forEach((feature) => {
    if (!feature.geometry || feature.geometry.type !== 'Point') return

    const geometry = feature.geometry
    const [lng, lat] = geometry.coordinates
    const latlng = L.latLng(lat, lng)
    const isSelected = selectedAssets.some((a) => a.id === feature.id)

    const marker = new L.Marker(latlng, {
      icon: getContainerFeatureIcon(feature as AssetFeature, isSelected),
      keyboard: false,
    })

    if (typeof feature.id === 'string' && feature.id) {
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
          lat,
          lng,
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

    markerClusterGroup.addLayer(marker)
  })

  assetLayerRef.current = markerClusterGroup
  markerClusterGroup.addTo(mapInstance)
}
