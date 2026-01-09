'use client'

import { Button } from '@amsterdam/design-system-react'
import useIsAfterBreakpoint from '@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import Form from 'next/form'
import { useActionState, useEffect, useState } from 'react'

import { Feature } from '@meldingen/api-client'

import type { Coordinates } from 'apps/melding-form/src/types'

import { AddressInput, AssetList, Notification, SideBarBottom, SideBarTop } from './_components'
import { postCoordinatesAndAssets } from './actions'

import styles from './SelectLocation.module.css'

const Controls = dynamic(() => import('@meldingen/map').then((module) => module.Controls), { ssr: false })
const Map = dynamic(() => import('@meldingen/map').then((module) => module.Map), {
  loading: () => <p>Loading...</p>, // TODO: improve loading state
  ssr: false,
})
const MarkerSelectLayer = dynamic(() => import('@meldingen/map').then((module) => module.MarkerSelectLayer), {
  ssr: false,
})
const PointSelectLayer = dynamic(() => import('@meldingen/map').then((module) => module.PointSelectLayer), {
  ssr: false,
})

type Props = {
  classification?: string
  coordinates?: Coordinates
  selectedAssets: Feature[]
}

export type NotificationType = 'too-many-assets' | 'location-service-disabled' | 'pdok-no-address-found'

const initialState: { errorMessage?: string } = {}

// 3 is the default maximum from the backend
export const MAX_ASSETS = 3

export const SelectLocation = ({
  classification,
  coordinates: coordinatesFromServer,
  selectedAssets: selectedAssetsFromServer,
}: Props) => {
  const [assetList, setAssetList] = useState<Feature[]>([])
  const [coordinates, setCoordinates] = useState<Coordinates | undefined>(coordinatesFromServer)
  const [notificationType, setNotificationType] = useState<NotificationType | null>(null)
  const [selectedAssets, setSelectedAssets] = useState<Feature[]>(selectedAssetsFromServer)
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
    <div className={clsx(styles.grid, showAssetList && styles.hasAssetList)}>
      <SideBarTop>
        <Form action={formAction} id="address" noValidate>
          <AddressInput
            actionErrorMessage={errorMessage}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            setNotificationType={setNotificationType}
            setSelectedAssets={setSelectedAssets}
          />
          <input
            defaultValue={coordinates ? JSON.stringify(coordinates) : undefined}
            name="coordinates"
            type="hidden"
          />
        </Form>
      </SideBarTop>
      <SideBarBottom isHidden={!showAssetList}>
        {notificationType === 'too-many-assets' && !isWideWindow && (
          <Notification onClose={() => setNotificationType(null)} type={notificationType} />
        )}
        <AssetList
          assetList={assetList}
          selectedAssets={selectedAssets}
          setCoordinates={setCoordinates}
          setNotificationType={setNotificationType}
          setSelectedAssets={setSelectedAssets}
        />
        <Button className={styles.hideButtonMobile} form="address" type="submit">
          {t('submit-button.desktop')}
        </Button>
      </SideBarBottom>
      <div className={styles.map}>
        <Map hasAlert={Boolean(notificationType)} isHidden={showAssetList}>
          <PointSelectLayer
            // If there are selected assets, do not add a point marker
            hideSelectedPoint={selectedAssets.length > 0}
            onSelectedPointChange={(coordinates) => {
              setSelectedAssets([])
              setCoordinates(coordinates)
            }}
            selectedPoint={coordinates}
          />
          <MarkerSelectLayer
            classification={classification}
            features={assetList}
            maxMarkers={MAX_ASSETS}
            onFeaturesChange={setAssetList}
            onMaxMarkersReached={(maxReached) => setNotificationType(maxReached ? 'too-many-assets' : null)}
            onSelectedMarkersChange={setSelectedAssets}
            selectedMarkers={selectedAssets}
            updateSelectedPoint={setCoordinates}
          />
          <Controls
            onCurrentLocationError={() => setNotificationType('location-service-disabled')}
            texts={controlsTexts}
            updateSelectedPoint={setCoordinates}
          >
            {notificationType && <Notification onClose={() => setNotificationType(null)} type={notificationType} />}
          </Controls>
        </Map>
        <div className={styles.buttonWrapper}>
          <Button
            className={clsx(styles.submitButton, showAssetList && styles.removeAbsolutePosition)}
            form="address"
            type="submit"
          >
            {t('submit-button.mobile')}
          </Button>
          {showAssetListToggleButton && (
            <Button
              className={clsx(styles.toggleButton, showAssetList && styles.removeAbsolutePosition)}
              onClick={() => setShowAssetList((prevState) => !prevState)}
              variant="secondary"
            >
              {showAssetList ? t('toggle-button.map') : t('toggle-button.list')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
