import { Column, Heading, Icon, Paragraph, Link } from '@amsterdam/design-system-react'
import { ChevronLeftIcon } from '@amsterdam/design-system-react-icons'
import NextLink from 'next/link'
import { useActionState, useEffect, useState } from 'react'

import type { Coordinates } from 'apps/public/src/types'

import { getAddressFromCoordinates } from '../../_utils'
import { AddressComboBox } from '../AddressComboBox/AddressComboBox'

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
    <Column className={styles.container}>
      <NextLink href="/locatie" legacyBehavior passHref>
        <Link href="dummy-href">
          <Icon svg={ChevronLeftIcon} size="level-4" />
        </Link>
      </NextLink>

      <div>
        <Heading level={1} size="level-4">
          Selecteer de locatie
        </Heading>
        <Paragraph size="small">
          Typ het dichtstbijzijnde adres, klik de locatie aan op de kaart of gebruik &quot;Mijn locatie&quot;
        </Paragraph>
      </div>
      <form action={formAction} id="address">
        <AddressComboBox
          address={address}
          setAddress={setAddress}
          setCoordinates={setCoordinates}
          errorMessage={formState?.message}
        />
        <input type="hidden" name="coordinates" defaultValue={address ? JSON.stringify(coordinates) : undefined} />
      </form>
    </Column>
  )
}
