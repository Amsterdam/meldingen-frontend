import { Button } from '@amsterdam/design-system-react'
import { MinusIcon, PlusIcon } from '@amsterdam/design-system-react-icons'
import type L from 'leaflet'
import { useTranslations } from 'next-intl'
import { PropsWithChildren } from 'react'

import type { Coordinates } from 'apps/melding-form/src/types'

import styles from './ControlsOverlay.module.css'

export type Props = PropsWithChildren & {
  mapInstance: L.Map | null
  setCoordinates: (coordinates: Coordinates) => void
  onCurrentLocationError: () => void
}

export const ControlsOverlay = ({ children, mapInstance, setCoordinates, onCurrentLocationError }: Props) => {
  const t = useTranslations('select-location.controls-overlay')

  const handleZoomIn = () => {
    mapInstance?.setZoom(mapInstance.getZoom() + 1)
  }
  const handleZoomOut = () => {
    mapInstance?.setZoom(mapInstance.getZoom() - 1)
  }

  // eslint-disable-next-line no-undef
  const onSuccess: PositionCallback = ({ coords }) => {
    // TODO: is this correct? What should happen when you click the button without a map instance?
    if (!mapInstance) return undefined

    const { latitude, longitude } = coords

    return setCoordinates({
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
          {t('current-location-button')}
        </Button>
        {children}
      </div>
      <div className={styles.overlayBottomRight}>
        <Button variant="secondary" iconOnly icon={PlusIcon} onClick={handleZoomIn}>
          {t('zoom-in')}
        </Button>
        <Button variant="secondary" iconOnly icon={MinusIcon} onClick={handleZoomOut}>
          {t('zoom-out')}
        </Button>
      </div>
    </>
  )
}
