import { clsx } from 'clsx'
import { latLng, Map, tileLayer } from 'leaflet'
import { createContext, PropsWithChildren, useEffect, useRef, useState } from 'react'

import 'leaflet/dist/leaflet.css'
import styles from './Map.module.css'

export type Props = PropsWithChildren & {
  hasAlert?: boolean
  isHidden?: boolean
  /* This prop is only used for unit tests. */
  testMapInstance?: Map
}

export const MapContext = createContext<Map | undefined>(undefined)

export const MapComponent = ({ children, hasAlert, isHidden, testMapInstance }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null)

  // Use state instead of a ref for storing the Leaflet map object otherwise you may run into DOM issues when React StrictMode is enabled
  const [mapInstance, setMapInstance] = useState<Map | undefined>(testMapInstance)

  // This could be a useState but as we don't expect this to fire more than once, use ref as it is mutable and won't trigger any further re-render
  const createdMapInstance = useRef(false)

  useEffect(() => {
    // Ensure that the target DOM element exists and that the map doesn't already exist (to prevent duplicate renders in StrictMode)
    if (mapRef.current === null || createdMapInstance.current !== false) {
      return undefined
    }

    const map = new Map(mapRef.current, {
      center: latLng([52.370216, 4.895168]),
      layers: [
        tileLayer('https://{s}.data.amsterdam.nl/topo_wm/{z}/{x}/{y}.png', {
          attribution: '',
          subdomains: ['t1', 't2', 't3', 't4'],
        }),
      ],
      // Prevent the user browsing too far outside Amsterdam otherwise the map will render blank greyspace.
      // Amsterdam tile layer only supports Amsterdam and the immediate surrounding areas
      maxBounds: [
        [52.25168, 4.64034],
        [52.50536, 5.10737],
      ],
      maxZoom: 18,
      minZoom: 11,
      zoom: 14,
      zoomControl: false,
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
  }, [])

  useEffect(() => {
    // Leaflet has to know it should recalculate dimensions of the map
    // when it is shown/hidden or has an Alert as this can change the size of the map container
    mapInstance?.invalidateSize()
  }, [isHidden, hasAlert])

  return (
    <MapContext.Provider value={mapInstance}>
      <div className={clsx(styles.container, isHidden && styles.hideMap, hasAlert && styles.notInteractive)}>
        <div className={styles.map} ref={mapRef} />
        {children}
      </div>
    </MapContext.Provider>
  )
}
