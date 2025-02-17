import { Heading, Paragraph } from '@amsterdam/design-system-react'
import { useActionState, useEffect, useState } from 'react'

import { BackLink } from 'apps/public/src/app/(general)/_components/BackLink'
import type { Coordinates } from 'apps/public/src/types'

import { getAddressFromCoordinates } from '../../_utils'
import { Combobox } from '../Combobox/Combobox'

import { writeAddressAndCoordinateToCookie } from './actions'
import styles from './SideBar.module.css'

type Props = {
  coordinates?: Coordinates
  setCoordinates: (coordinates: Coordinates) => void
}

export type Address = {
  id: string
  weergave_naam: string
}

const initialState: { message?: string } = {}

export const SideBar = ({ coordinates, setCoordinates }: Props) => {
  const [formState, formAction] = useActionState(writeAddressAndCoordinateToCookie, initialState)

  const [address, setAddress] = useState<Address>()

  // TODO: this can just be a function, called on setCoordinates I think
  useEffect(() => {
    const getAddress = async () => {
      if (!coordinates) return

      const result = await getAddressFromCoordinates({ lat: coordinates.lat, lng: coordinates.lng })

      if (result) {
        setAddress(result)
      }
    }
    getAddress()
  }, [coordinates])

  return (
    <div className={styles.container}>
      <BackLink href="/locatie">Vorige vraag</BackLink>
      <div className={styles.intro}>
        <Heading level={1} size="level-4">
          Selecteer de locatie
        </Heading>
        <Paragraph size="small">
          Typ het dichtstbijzijnde adres, klik de locatie aan op de kaart of gebruik &quot;Mijn locatie&quot;
        </Paragraph>
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
