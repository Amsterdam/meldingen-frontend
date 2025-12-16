import { Button } from '@amsterdam/design-system-react'
import { MinusIcon, PlusIcon } from '@amsterdam/design-system-react-icons'
import { PropsWithChildren, useContext } from 'react'

import type { Coordinates } from '../types'

import { MapContext } from '../Map/Map'

import styles from './Controls.module.css'

export type Props = PropsWithChildren & {
  onCurrentLocationError: () => void
  texts: {
    currentLocation: string
    zoomIn: string
    zoomOut: string
  }
  updateSelectedPoint: (point?: Coordinates) => void
}

export const Controls = ({ children, onCurrentLocationError, texts, updateSelectedPoint }: Props) => {
  const map = useContext(MapContext)

  const handleZoomIn = () => {
    map?.setZoom(map.getZoom() + 1)
  }
  const handleZoomOut = () => {
    map?.setZoom(map.getZoom() - 1)
  }

  // eslint-disable-next-line no-undef
  const onSuccess: PositionCallback = ({ coords }) => {
    // TODO: is this correct? What should happen when you click the button without a map instance?
    if (!map) return undefined

    const { latitude, longitude } = coords

    return updateSelectedPoint({
      lat: latitude,
      lng: longitude,
    })
  }

  const onError = () => onCurrentLocationError()

  const handleCurrentLocationButtonClick = () => navigator.geolocation.getCurrentPosition(onSuccess, onError)

  return (
    <>
      <div className={styles.overlayTopLeft}>
        <Button className={styles.interactive} onClick={handleCurrentLocationButtonClick} variant="secondary">
          {texts.currentLocation}
        </Button>
        {children}
      </div>
      <div className={styles.overlayBottomRight}>
        <Button className={styles.interactive} icon={PlusIcon} iconOnly onClick={handleZoomIn} variant="secondary">
          {texts.zoomIn}
        </Button>
        <Button className={styles.interactive} icon={MinusIcon} iconOnly onClick={handleZoomOut} variant="secondary">
          {texts.zoomOut}
        </Button>
      </div>
    </>
  )
}
