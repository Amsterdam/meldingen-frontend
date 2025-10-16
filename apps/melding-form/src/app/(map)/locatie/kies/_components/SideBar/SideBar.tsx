import { Heading, Paragraph } from '@amsterdam/design-system-react'
import Form from 'next/form'
import { useTranslations } from 'next-intl'
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from 'react'

import { Feature } from '@meldingen/api-client'

import { postCoordinatesAndAssets } from './actions'
import { getAddressFromCoordinates } from '../../_utils'
import { Combobox } from '../Combobox/Combobox'
import { BackLink } from 'apps/melding-form/src/app/(general)/_components/BackLink/BackLink'
import type { Coordinates } from 'apps/melding-form/src/types'

import styles from './SideBar.module.css'

export type Props = {
  coordinates?: Coordinates
  setCoordinates: (coordinates?: Coordinates) => void
  setSelectedAssets: Dispatch<SetStateAction<Feature[]>>
  selectedAssets: Feature[]
}

const initialState: { errorMessage?: string } = {}

export const SideBar = ({ coordinates, setCoordinates, setSelectedAssets, selectedAssets }: Props) => {
  const postCoordinatesAndAssetsWithSelectedAssets = postCoordinatesAndAssets.bind(null, {
    selectedAssets,
  })
  const [{ errorMessage }, formAction] = useActionState(postCoordinatesAndAssetsWithSelectedAssets, initialState)

  const [address, setAddress] = useState<string>('')

  const t = useTranslations('select-location')

  useEffect(() => {
    if (!coordinates) {
      setAddress('')
      return
    }

    const getAddress = async () => {
      try {
        const result = await getAddressFromCoordinates({
          lat: coordinates.lat,
          lng: coordinates.lng,
        })

        if (result) {
          setAddress(result)
        } else {
          // If there is no address within 30 meters of the location that is clicked (e.g. water or middle of a park),
          // PDOK does not return an address. Therefore we use a default no address label.
          setAddress(t('combo-box.no-address'))
        }
        return undefined
      } catch (error) {
        // eslint-disable-next-line no-console
        return console.error(error)
      }
    }
    getAddress()
  }, [coordinates, t])

  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        <BackLink className="ams-mb-s" href="/locatie">
          {t('back-link')}
        </BackLink>
        <Heading level={1} size="level-2">
          {t('title')}
        </Heading>
        <Paragraph>{t('description')}</Paragraph>
      </div>
      <Form action={formAction} id="address" noValidate>
        <Combobox
          address={address}
          setAddress={setAddress}
          setCoordinates={setCoordinates}
          errorMessage={errorMessage}
          setSelectedAssets={setSelectedAssets}
        />
        <input type="hidden" name="coordinates" defaultValue={address ? JSON.stringify(coordinates) : undefined} />
      </Form>
    </div>
  )
}
