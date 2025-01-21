import { Column, Heading, Icon, Paragraph, Link, Button } from '@amsterdam/design-system-react'
import { ChevronLeftIcon } from '@amsterdam/design-system-react-icons'
import NextLink from 'next/link'
import { useActionState, useEffect, useState } from 'react'

import { getAddressFromCoordinates } from '../../_utils'
import type { Coordinates } from '../../page'
import { AddressComboBox } from '../AddressComboBox/AddressComboBox'

import { writeAddressAndCoordinateToCookie } from './actions'

type Props = {
  coordinates?: Coordinates
}

export type Address = {
  id: string
  weergave_naam: string
}

const initialState: { message?: string } = {}

export const SideBar = ({ coordinates }: Props) => {
  const [formState, formAction] = useActionState(writeAddressAndCoordinateToCookie, initialState)

  console.log('----formstate', formState)

  const [address, setAddress] = useState<Address | null>(null)

  // TODO: this can just be a function, called on setCoordinates I think
  useEffect(() => {
    const getAddress = async () => {
      if (!coordinates) return

      const result = await getAddressFromCoordinates({ lat: coordinates.lat, lon: coordinates.lon })

      if (result) {
        setAddress(result)
      }
    }
    getAddress()
  }, [coordinates])

  return (
    <Column>
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
      <form action={formAction}>
        <AddressComboBox address={address} setAddress={setAddress} />
        <Button type="submit">Bevestigen</Button>
      </form>
    </Column>
  )
}
