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

import { AssetList, AssetListToggle, Combobox, Notification, SideBar } from './_components'
import { getAddressFromCoordinates } from './_utils'
import { postCoordinatesAndAssets } from './actions'
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

const initialState: { errorMessage?: string } = {}

const fetchAndSetAddress = async (
  coordinates: Coordinates,
  setAddress: (address: string) => void,
  t: ReturnType<typeof useTranslations>,
) => {
  try {
    const result = await getAddressFromCoordinates({
      lat: coordinates.lat,
      lng: coordinates.lng,
    })
    if (result) {
      setAddress(result)
    } else {
      setAddress(t('combo-box.no-address'))
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}

export const SelectLocation = ({ classification, coordinates: coordinatesFromServer }: Props) => {
  const [address, setAddress] = useState('')
  const [assetList, setAssetList] = useState<Feature[]>([])
  const [coordinates, setCoordinates] = useState<Coordinates | undefined>(coordinatesFromServer)
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [notification, setNotification] = useState<NotificationType | null>(null)
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
    notification,
    selectedAssets,
    setAssetList,
    setCoordinates,
    setNotification,
    setSelectedAssets,
  })

  useEffect(() => {
    if (isWideWindow) setShowAssetList(false)
  }, [isWideWindow])

  useEffect(() => {
    if (!coordinates) {
      setAddress('')
      return
    }
    fetchAndSetAddress(coordinates, setAddress, t)
  }, [coordinates, t])

  return (
    <div className={styles.grid}>
      <SideBar>
        <Form action={formAction} id="address" noValidate>
          <Combobox
            address={address}
            errorMessage={errorMessage}
            setAddress={setAddress}
            setCoordinates={setCoordinates}
            setSelectedAssets={setSelectedAssets}
          />
          <input type="hidden" name="coordinates" defaultValue={address ? JSON.stringify(coordinates) : undefined} />
        </Form>
      </SideBar>

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
