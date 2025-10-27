import L, { divIcon, latLng, Layer, Marker, MarkerCluster, MarkerClusterGroup } from 'leaflet'
import 'leaflet.markercluster'
import { useContext, useEffect, useRef } from 'react'

import { Feature, getWfsByName } from '@meldingen/api-client'

import { MapContext } from '../Map/Map'
import { getContainerFeatureIcon } from './utils/getContainerFeatureIcon'
import { getWfsFilter } from './utils/getWfsFilter'

import './cluster.css'

export const ASSET_ZOOM_THRESHOLD = 16

export const createClusterIcon = (cluster: MarkerCluster) => {
  // Cluster markers should not be keyboard accessible
  cluster.options.keyboard = false

  return divIcon({
    html: cluster.getChildCount().toString(),
    className: 'meldingen-cluster',
    iconSize: [70, 70],
    iconAnchor: [35, 35],
  })
}

type Props = {
  markers: Feature[]
  onMarkersChange: (markers: Feature[]) => void
}

export const MarkerSelectLayer = ({ markers, onMarkersChange }: Props) => {
  const map = useContext(MapContext)
  // const markersRef = useRef<Record<string, Marker>>({})
  const assetLayerRef = useRef<Layer | null>(null)

  useEffect(() => {
    map?.on('moveend', async () => {
      // Don't fetch assets when map is hidden with display: none
      const size = map.getSize()
      const mapIsHidden = size.x === 0 && size.y === 0

      if (mapIsHidden) return

      const zoom = map.getZoom()

      // Has correct zoom level for assets
      if (zoom >= ASSET_ZOOM_THRESHOLD) {
        const filter = getWfsFilter(map)

        const { data, error } = await getWfsByName({
          path: { name: 'container' },
          query: { filter },
        })

        if (error) throw new Error(`${error}`)

        onMarkersChange(data?.features || [])
      }
    })
  }, [map])

  useEffect(() => {
    if (!map || markers.length === 0) return

    const markerClusterGroup = L.markerClusterGroup({
      iconCreateFunction: createClusterIcon,
      showCoverageOnHover: false,
    }) as MarkerClusterGroup

    markers.forEach((feature) => {
      if (!feature.geometry || feature.geometry.type !== 'Point') return

      const geometry = feature.geometry
      const [lng, lat] = geometry.coordinates
      const latlng = latLng(lat, lng)
      // const isSelected = selectedAssets.some((a) => a.id === feature.id)

      const marker = new Marker(latlng, {
        icon: getContainerFeatureIcon(feature, false),
        keyboard: false,
      })

      // if (feature.id !== null && (typeof feature.id === 'string' || typeof feature.id === 'number')) {
      //   assetMarkersRef.current[feature.id] = marker
      // }

      markerClusterGroup.addLayer(marker)
    })

    assetLayerRef.current = markerClusterGroup
    markerClusterGroup.addTo(map)
  }, [map, markers])

  return undefined
}
