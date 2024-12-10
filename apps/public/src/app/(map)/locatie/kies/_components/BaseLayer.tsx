import L from 'leaflet'
import { useEffect, useRef, useState } from 'react'

import 'leaflet/dist/leaflet.css'
import { getCrsRd } from './getCrsRd'
import styles from './map.module.css'

export const BaseLayer = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Use state instead of a ref for storing the Leaflet map object otherwise you may run into DOM issues when React StrictMode is enabled
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)

  // This could be a useState but as we don't expect this to fire more than once, use ref as it is mutable and won't trigger any further re-render
  const createdMapInstance = useRef(false)

  useEffect(() => {
    // Ensure that the target DOM element exists and that the map doesn't already exist (to prevent duplicate renders in StrictMode)
    if (containerRef.current === null || createdMapInstance.current !== false) {
      return undefined
    }

    const map = new L.Map(containerRef.current, {
      center: L.latLng([52.370216, 4.895168]),
      zoom: 12,
      layers: [
        L.tileLayer('https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png', {
          attribution: '',
          subdomains: ['t1', 't2', 't3', 't4'],
          tms: true,
        }),
      ],
      zoomControl: false,
      maxZoom: 16,
      minZoom: 6,
      // Ensure proper handling for Rijksdriehoekcoördinaten
      crs: getCrsRd(),
      // Prevent the user browsing too far outside Amsterdam otherwise the map will render blank greyspace. Amsterdam tile layer only supports Amsterdam and the immediate surrounding areas
      maxBounds: [
        [52.25168, 4.64034],
        [52.50536, 5.10737],
      ],
    })

    // Remove Leaflet link from the map
    map.attributionControl.setPrefix(false)

    // Set the map as created and store the object to state
    createdMapInstance.current = true
    setMapInstance(map)

    // On component unmount, destroy the map and all related events
    return () => {
      if (mapInstance) mapInstance.remove()
    }
  }, [mapInstance])

  return <div className={styles.container} ref={containerRef} />
}
