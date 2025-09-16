'use client'

import { Button } from '@amsterdam/design-system-react'
import useIsAfterBreakpoint from '@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint'
import clsx from 'clsx'
import L from 'leaflet'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { Feature } from '@meldingen/api-client'

import { AssetList } from './_components/AssetList/AssetList'
import { AssetListToggle } from './_components/AssetListToggle/AssetListToggle'
import { Notification } from './_components/Map/components/Notification/Notification'
import { SideBar } from './_components/SideBar/SideBar'
import { useAssetLayer } from './hooks/useAssetLayer'
import { NotificationType } from './types'
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

export const SelectLocation = ({ classification, coordinates: coordinatesFromServer }: Props) => {
  const [coordinates, setCoordinates] = useState<Coordinates | undefined>(coordinatesFromServer)
  const [showAssetList, setShowAssetList] = useState(false)
  const [assetList, setAssetList] = useState<Feature[]>([])
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [selectedAssets, setSelectedAssets] = useState<Feature[]>([])
  const [notification, setNotification] = useState<NotificationType | null>(null)

  const t = useTranslations('select-location')

  const isWideWindow = useIsAfterBreakpoint('wide')

  useAssetLayer({
    assetList,
    classification,
    mapInstance,
    notification,
    selectedAssets,
    setAssetList,
    setCoordinates,
    setNotification,
    setSelectedAssets,
  })

  useEffect(() => {
    // Hide mobile asset list view when resizing to larger screens
    if (isWideWindow) {
      setShowAssetList(false)
    }
  }, [isWideWindow])

  return (
    <div className={styles.grid}>
      <SideBar coordinates={coordinates} setCoordinates={setCoordinates} setSelectedAssets={setSelectedAssets} />
      <div className={clsx(styles.assetList, showAssetList && styles.showAssetList)}>
        {notification && !isWideWindow && (
          <Notification
            closeButtonLabel={notification.closeButtonLabel}
            description={notification.description}
            heading={notification.heading}
            onClose={() => setNotification(null)}
            severity={notification.severity}
          />
        )}
        <AssetList
          assetList={assetList}
          selectedAssets={selectedAssets}
          setCoordinates={setCoordinates}
          notification={notification}
          setNotification={setNotification}
          setSelectedAssets={setSelectedAssets}
        />
        <Button form="address" type="submit" className={styles.hideButtonMobile}>
          {t('submit-button.desktop')}
        </Button>
      </div>
      <div className={styles.map}>
        <Map
          coordinates={coordinates}
          mapInstance={mapInstance}
          notification={notification}
          selectedAssets={selectedAssets}
          setCoordinates={setCoordinates}
          setMapInstance={setMapInstance}
          setNotification={setNotification}
          setSelectedAssets={setSelectedAssets}
          showAssetList={showAssetList}
        />
        <div className={styles.buttonWrapper}>
          <Button
            form="address"
            type="submit"
            className={clsx(styles.submitbutton, showAssetList && styles.removeAbsolutePosition)}
          >
            {t('submit-button.mobile')}
          </Button>
          <AssetListToggle
            assetList={assetList}
            mapInstance={mapInstance}
            setShowAssetList={setShowAssetList}
            showAssetList={showAssetList}
            selectedAssets={selectedAssets}
          />
        </div>
      </div>
    </div>
  )
}
