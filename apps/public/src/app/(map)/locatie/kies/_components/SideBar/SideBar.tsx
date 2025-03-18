import { Heading, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useState } from 'react'

import { writeAddressAndCoordinateToCookie } from './actions'
import { getAddressFromCoordinates } from '../../_utils'
import { Combobox } from '../Combobox/Combobox'
import { BackLink } from 'apps/public/src/app/(general)/_components/BackLink'
import type { Coordinates } from 'apps/public/src/types'

import styles from './SideBar.module.css'

type Props = {
  coordinates?: Coordinates
  setCoordinates: (coordinates: Coordinates) => void
}

export type Address = {
  id?: string
  weergave_naam: string
}

const initialState: { message?: string } = {}

export const SideBar = ({ coordinates, setCoordinates }: Props) => {
  const [formState, formAction] = useActionState(writeAddressAndCoordinateToCookie, initialState)

  const [address, setAddress] = useState<Address>()

  const t = useTranslations('select-location')

  // TODO: this can just be a function, called on setCoordinates I think
  useEffect(() => {
    const getAddress = async () => {
      if (!coordinates) return

      const result = await getAddressFromCoordinates({
        lat: coordinates.lat,
        lng: coordinates.lng,
      })

      if (result?.id && result?.weergave_naam) {
        setAddress(result)
      } else {
        // If there is no address within 30 meters of the location that is clicked (e.g. water or middle of a park),
        // PDOK does not return an address. Therefore we use a default no address label.
        setAddress({
          id: undefined,
          weergave_naam: t('combo-box.no-address'),
        })
      }
    }
    getAddress()
  }, [coordinates, t])

  return (
    <div className={styles.container}>
      <BackLink href="/locatie">{t('back-link')}</BackLink>
      <div className={styles.intro}>
        <Heading level={1} size="level-4">
          {t('title')}
        </Heading>
        <Paragraph size="small">{t('description')}</Paragraph>
      </div>
      <form action={formAction} id="address">
        <Combobox
          address={address}
          setAddress={setAddress}
          setCoordinates={setCoordinates}
          errorMessage={formState?.message}
        />
        <input type="hidden" name="coordinates" defaultValue={address ? JSON.stringify(coordinates) : undefined} />
      </form>
    </div>
  )
}
