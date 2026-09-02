import type { PropsWithChildren, RefObject } from 'react'

import { clsx } from 'clsx'
import { latLng, Map, tileLayer } from 'leaflet'
import { createContext, useEffect, useImperativeHandle, useRef, useState } from 'react'

import getCrsRd from './utils/getCrsRd'

import 'leaflet/dist/leaflet.css'
import styles from './Map.module.css'

export type Props = PropsWithChildren & {
  isHidden?: boolean
  isInert?: boolean
  /*
   * Note: this is intentionally not called `ref`. Map is loaded via next/dynamic in consuming
   * apps, and next/dynamic intercepts a prop literally named `ref` to expose its own retry
   * handle instead of forwarding it to the loaded component.
   */
  mapHandleRef?: RefObject<{ invalidateSize: () => void } | null>
  /* This prop is only used for unit tests. */
  testMapInstance?: Map
}

export const MapContext = createContext<Map | undefined>(undefined)

export const MapComponent = ({ children, isHidden, isInert, mapHandleRef, testMapInstance }: Props) => {
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
      crs: getCrsRd(),
      layers: [
        tileLayer('https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png', {
          attribution: '',
          subdomains: ['t1', 't2', 't3', 't4'],
          tms: true,
        }),
      ],
      // Prevent the user browsing too far outside Amsterdam otherwise the map will render blank greyspace.
      // Amsterdam tile layer only supports Amsterdam and the immediate surrounding areas
      maxBounds: [
        [52.25168, 4.64034],
        [52.50536, 5.10737],
      ],
      maxZoom: 16,
      minZoom: 8,
      zoom: 10,
      zoomControl: false,
    })

    // Remove Leaflet link from the map
    map.attributionControl.setPrefix(false)

    // Set the map as created and store the object to state
    createdMapInstance.current = true
    setMapInstance(map)

    // On component unmount, destroy the map and all related events
    return () => {
      map.remove()
      createdMapInstance.current = false
    }
  }, [])

  useImperativeHandle(mapHandleRef, () => ({
    // Expose the invalidateSize method outside of the component
    invalidateSize: () => mapInstance?.invalidateSize(),
  }))

  useEffect(() => {
    // Showing/hiding the map changes its container size, so Leaflet needs to recalculate
    // dimensions. Leaflet also uses the container size to position tiles, and while hidden
    // that size is 0x0, so the view has to be reset once the correct size is known again.
    mapInstance?.invalidateSize()
    mapInstance?.fire('viewreset')
  }, [mapInstance, isHidden])

  return (
    <MapContext.Provider value={mapInstance}>
      <div className={clsx(styles.container, isHidden && styles.hideMap)}>
        <div className={styles.map} inert={isInert} ref={mapRef} />
        {children}
      </div>
    </MapContext.Provider>
  )
}
