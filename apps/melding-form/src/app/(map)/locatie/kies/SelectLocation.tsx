'use client'

import { Button } from '@amsterdam/design-system-react'
import useIsAfterBreakpoint from '@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Form from 'next/form'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useState } from 'react'

import { Feature } from '@meldingen/api-client'
import { Controls, MarkerSelectLayer, PointSelectLayer } from '@meldingen/map'

import { AddressInput, AssetList, Notification, SideBarBottom, SideBarTop } from './_components'
import { postCoordinatesAndAssets } from './actions'
import type { Coordinates } from 'apps/melding-form/src/types'

import styles from './SelectLocation.module.css'

const Map = dynamic(() => import('@meldingen/map').then((module) => module.Map), {
  loading: () => <p>Loading...</p>, // TODO: improve loading state
  ssr: false,
})

type Props = {
  classification?: string
  coordinates?: Coordinates
}

export type NotificationType = 'too-many-assets' | 'location-service-disabled'

const initialState: { errorMessage?: string } = {}

export const SelectLocation = ({ coordinates: coordinatesFromServer }: Props) => {
  const [assetList, setAssetList] = useState<Feature[]>([])
  const [coordinates, setCoordinates] = useState<Coordinates | undefined>(coordinatesFromServer)
  const [notificationType, setNotificationType] = useState<NotificationType | null>(null)
  const [selectedAssets, setSelectedAssets] = useState<Feature[]>([])
  const [showAssetList, setShowAssetList] = useState(false)

  const postCoordinatesAndAssetsWithSelectedAssets = postCoordinatesAndAssets.bind(null, { selectedAssets })
  const [{ errorMessage }, formAction] = useActionState(postCoordinatesAndAssetsWithSelectedAssets, initialState)

  const t = useTranslations('select-location')
  const isWideWindow = useIsAfterBreakpoint('wide')
  const controlsTexts = {
    currentLocation: t('controls-overlay.current-location-button'),
    zoomIn: t('controls-overlay.zoom-in'),
    zoomOut: t('controls-overlay.zoom-out'),
  }

  useEffect(() => {
    // Hide mobile asset list view when resizing to larger screens
    if (isWideWindow) setShowAssetList(false)
  }, [isWideWindow])

  const showAssetListToggleButton = assetList.length !== 0 || selectedAssets.length !== 0

  return (
    <div className={styles.grid}>
      <SideBarTop>
        <Form action={formAction} id="address" noValidate>
          <AddressInput
            coordinates={coordinates}
            errorMessage={errorMessage}
            setCoordinates={setCoordinates}
            setSelectedAssets={setSelectedAssets}
          />
          <input
            type="hidden"
            name="coordinates"
            defaultValue={coordinates ? JSON.stringify(coordinates) : undefined}
          />
        </Form>
      </SideBarTop>
      <SideBarBottom isHidden={!showAssetList}>
        {notificationType === 'too-many-assets' && !isWideWindow && (
          <Notification type={notificationType} onClose={() => setNotificationType(null)} />
        )}
        <AssetList
          assetList={assetList}
          selectedAssets={selectedAssets}
          setCoordinates={setCoordinates}
          setNotificationType={setNotificationType}
          setSelectedAssets={setSelectedAssets}
        />
        <Button form="address" type="submit" className={styles.hideButtonMobile}>
          {t('submit-button.desktop')}
        </Button>
      </SideBarBottom>
      <div className={styles.map}>
        <Map>
          <PointSelectLayer
            // If there are selected assets, do not add a pointer marker
            selectedPoint={selectedAssets.length === 0 ? coordinates : undefined}
            onSelectedPointChange={(coordinates) => {
              setSelectedAssets([])
              setCoordinates(coordinates)
            }}
          />
          <MarkerSelectLayer
            markers={assetList}
            selectedMarkers={selectedAssets}
            onMarkersChange={setAssetList}
            onSelectedMarkersChange={setSelectedAssets}
            updateSelectedPoint={setCoordinates}
            onMaxMarkersReached={(maxReached) => setNotificationType(maxReached ? 'too-many-assets' : null)}
          />
          <Controls
            texts={controlsTexts}
            updateSelectedPoint={setCoordinates}
            onCurrentLocationError={() => setNotificationType('location-service-disabled')}
          >
            {notificationType && <Notification type={notificationType} onClose={() => setNotificationType(null)} />}
          </Controls>
        </Map>
        <div className={styles.buttonWrapper}>
          <Button
            form="address"
            type="submit"
            className={clsx(styles.submitbutton, showAssetList && styles.removeAbsolutePosition)}
          >
            {t('submit-button.mobile')}
          </Button>
          {showAssetListToggleButton && (
            <Button
              variant="secondary"
              onClick={() => setShowAssetList((prevState) => !prevState)}
              className={clsx(styles.toggleButton, showAssetList && styles.removeAbsolutePosition)}
            >
              {showAssetList ? t('toggle-button.map') : t('toggle-button.list')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
