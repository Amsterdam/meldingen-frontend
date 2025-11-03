import { Button } from '@amsterdam/design-system-react'
import { MinusIcon, PlusIcon } from '@amsterdam/design-system-react-icons'
import { PropsWithChildren, useContext } from 'react'

import { MapContext } from '../Map/Map'
import type { Coordinates } from 'apps/melding-form/src/types'

import styles from './Controls.module.css'

export type Props = PropsWithChildren & {
  texts: {
    currentLocation: string
    zoomIn: string
    zoomOut: string
  }
  updateSelectedPoint: (point?: Coordinates) => void
  onCurrentLocationError: () => void
}

export const defaultTexts = {
  currentLocation: 'Mijn locatie',
  zoomIn: 'Inzoomen',
  zoomOut: 'Uitzoomen',
}

export const Controls = ({ children, texts = defaultTexts, updateSelectedPoint, onCurrentLocationError }: Props) => {
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
        <Button variant="secondary" onClick={handleCurrentLocationButtonClick}>
          {texts.currentLocation}
        </Button>
        {children}
      </div>
      <div className={styles.overlayBottomRight}>
        <Button variant="secondary" iconOnly icon={PlusIcon} onClick={handleZoomIn}>
          {texts.zoomIn}
        </Button>
        <Button variant="secondary" iconOnly icon={MinusIcon} onClick={handleZoomOut}>
          {texts.zoomOut}
        </Button>
      </div>
    </>
  )
}
