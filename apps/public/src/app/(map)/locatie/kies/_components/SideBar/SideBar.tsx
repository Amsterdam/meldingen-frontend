import { Column, Heading, Icon, Paragraph, Link, TextInput, Label } from '@amsterdam/design-system-react'
import { ChevronLeftIcon } from '@amsterdam/design-system-react-icons'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label as HUILabel } from '@headlessui/react'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'

import { getAddressFromCoordinates } from '../../_utils'
import type { Coordinates } from '../../page'
import { ListBox } from '../ListBox/ListBox'

type Props = {
  coordinates?: Coordinates
}

const addressOptions = [
  {
    id: 1,
    weergave_naam: 'Amsterdam',
  },
  {
    id: 2,
    weergave_naam: 'Rotterdam',
  },
  {
    id: 3,
    weergave_naam: 'Utrecht',
  },
]

export const SideBar = ({ coordinates }: Props) => {
  const [address, setAddress] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const getAddress = async () => {
      if (!coordinates) return
      const result = await getAddressFromCoordinates({ lat: coordinates.lat, lon: coordinates.lon })

      setAddress(result)
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
      <div>
        <Heading level={2} size="level-4">
          Zoek op adres
        </Heading>
        {address && <div>{address}</div>}
        <Field>
          <HUILabel as={Label}>Zoek op adres</HUILabel>
          <Combobox>
            <ComboboxInput
              aria-label="Adres"
              as={TextInput}
              displayValue={(a: any) => a?.weergave_naam}
              name="address"
              // onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
            {!loading && (
              <ComboboxOptions as={ListBox}>
                {addressOptions.length > 0 ? (
                  addressOptions.map(({ id, weergave_naam }) => (
                    <ComboboxOption key={id} value={weergave_naam} as={ListBox.Option}>
                      {weergave_naam}
                    </ComboboxOption>
                  ))
                ) : (
                  <ComboboxOption value="" disabled as={ListBox.Option}>
                    Geen resultaten gevonden
                  </ComboboxOption>
                )}
              </ComboboxOptions>
            )}
          </Combobox>
        </Field>
      </div>
    </Column>
  )
}
