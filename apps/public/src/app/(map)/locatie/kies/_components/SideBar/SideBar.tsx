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
    id: 'a',
    weergave_naam: 'Amsterdam',
  },
  {
    id: 'b',
    weergave_naam: 'Rotterdam',
  },
  {
    id: 'c',
    weergave_naam: 'Utrecht',
  },
]

type Address = {
  id: string
  weergave_naam: string
}

export const SideBar = ({ coordinates }: Props) => {
  const [address, setAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const [query, setQuery] = useState('')

  const filteredAddresses =
    query === ''
      ? addressOptions
      : addressOptions.filter((option) => option.weergave_naam.toLowerCase().includes(query.toLowerCase()))

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
      <div>
        <Field>
          <HUILabel as={Label}>Zoek op adres</HUILabel>
          <Combobox value={address} onChange={setAddress} onClose={() => setQuery('')}>
            <ComboboxInput
              aria-label="Adres"
              as={TextInput}
              displayValue={(item: Address) => item?.weergave_naam}
              name="address"
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
            {!loading && (
              <ComboboxOptions as={ListBox} modal={false}>
                {filteredAddresses.length > 0 ? (
                  filteredAddresses.map((test) => (
                    <ComboboxOption key={test.id} value={test} as={ListBox.Option}>
                      {test.weergave_naam}
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
