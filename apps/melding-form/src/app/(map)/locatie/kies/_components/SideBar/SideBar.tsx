import { Heading, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useState } from 'react'

import { writeAddressAndCoordinateToCookie } from './actions'
import { getAddressFromCoordinates } from '../../_utils'
import { Combobox } from '../Combobox/Combobox'
import type { Coordinates } from 'apps/melding-form/src/types'

import styles from './SideBar.module.css'

type Props = {
  coordinates?: Coordinates
  setCoordinates: (coordinates: Coordinates) => void
}

const initialState: { errorMessage: string } = {}

export const SideBar = ({ coordinates, setCoordinates }: Props) => {
  const [formState, formAction] = useActionState(writeAddressAndCoordinateToCookie, initialState)

  const [address, setAddress] = useState<string>()

  const t = useTranslations('select-location')

  // TODO: this can just be a function, called on setCoordinates I think
  useEffect(() => {
    if (!coordinates) return

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
