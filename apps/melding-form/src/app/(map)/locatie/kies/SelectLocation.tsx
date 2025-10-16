'use client'

import { Button } from '@amsterdam/design-system-react'
import useIsAfterBreakpoint from '@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint'
import clsx from 'clsx'
import L from 'leaflet'
import dynamic from 'next/dynamic'
import Form from 'next/form'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useState } from 'react'

import { Feature } from '@meldingen/api-client'

import { AddressInput, AssetList, Notification, SideBarBottom, SideBarTop } from './_components'
import { postCoordinatesAndAssets } from './actions'
import { useAssetLayer } from './hooks/useAssetLayer'
import type { Coordinates } from 'apps/melding-form/src/types'

import styles from './SelectLocation.module.css'

const Map = dynamic(() => import('./_components/Map/Map').then((module) => module.Map), {
  loading: () => <p>Loading...</p>, // TODO: improve loading state
  ssr: false,
})

type Props = {
  classification?: string
  coordinates?: Coordinates
}

export type NotificationType = 'too-many-assets' | 'location-service-disabled' | null

const initialState: { errorMessage?: string } = {}

export const SelectLocation = ({ classification, coordinates: coordinatesFromServer }: Props) => {
  const [assetList, setAssetList] = useState<Feature[]>([])
  const [coordinates, setCoordinates] = useState<Coordinates | undefined>(coordinatesFromServer)
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [notificationType, setNotificationType] = useState<NotificationType>(null)
  const [selectedAssets, setSelectedAssets] = useState<Feature[]>([])
  const [showAssetList, setShowAssetList] = useState(false)

  const postCoordinatesAndAssetsWithSelectedAssets = postCoordinatesAndAssets.bind(null, { selectedAssets })
  const [{ errorMessage }, formAction] = useActionState(postCoordinatesAndAssetsWithSelectedAssets, initialState)

  const t = useTranslations('select-location')
  const isWideWindow = useIsAfterBreakpoint('wide')

  useAssetLayer({
    assetList,
    classification,
    mapInstance,
    selectedAssets,
    setAssetList,
    setCoordinates,
    setNotificationType,
    setSelectedAssets,
  })

  useEffect(() => {
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
        <Map
          coordinates={coordinates}
          isHidden={!isWideWindow && showAssetList}
          mapInstance={mapInstance}
          selectedAssets={selectedAssets}
          setCoordinates={setCoordinates}
          setMapInstance={setMapInstance}
          setSelectedAssets={setSelectedAssets}
          onCurrentLocationError={() => setNotificationType('location-service-disabled')}
        >
          {notificationType && <Notification type={notificationType} onClose={() => setNotificationType(null)} />}
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
