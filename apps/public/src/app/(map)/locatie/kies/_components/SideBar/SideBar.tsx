import { Column, Heading, Icon, Paragraph, Link, TextInput, Label } from '@amsterdam/design-system-react'
import { ChevronLeftIcon } from '@amsterdam/design-system-react-icons'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label as HUILabel } from '@headlessui/react'
import { ListBox } from '@meldingen/ui'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'

import { getAddressFromCoordinates } from '../../_utils'
import type { Coordinates } from '../../page'

type Props = {
  coordinates?: Coordinates
}

type Address = {
  id: string
  weergave_naam: string
}

const pdokQueryParams =
  'fq=bron:BAG&fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=id,weergavenaam&rows=5'

// eslint-disable-next-line @typescript-eslint/ban-types
const debounce = (fn: Function, delay = 250) => {
  let timer: ReturnType<typeof setTimeout>

  return (...args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export const SideBar = ({ coordinates }: Props) => {
  const [address, setAddress] = useState<Address | null>(null)
  const [addressList, setAddressList] = useState<Address[]>([])
  const [showListBox, setShowListBox] = useState(false)

  // TODO: do we want to show a loading state?
  const fetchAddressList = debounce(async (query: string) => {
    if (query.length >= 3) {
      try {
        const response = await fetch(
          `https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?${pdokQueryParams}&q=${query}`,
        )
        const responseData = await response.json()

        if (response.ok) {
          const responseList = responseData.response.docs.map((item: { id: string; weergavenaam: string }) => ({
            id: item.id,
            weergave_naam: item.weergavenaam,
          }))

          setAddressList(responseList)
          setShowListBox(true)
        }
      } catch (error) {
        // TODO: handle error properly
        console.error(error)
      }
    } else {
      setAddressList([])
      setShowListBox(false)
    }
  })

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
      <div>
        <Field>
          <HUILabel as={Label}>Zoek op adres</HUILabel>
          <Combobox value={address} onChange={setAddress} onClose={() => fetchAddressList('')}>
            <ComboboxInput
              as={TextInput}
              displayValue={(item: Address) => item?.weergave_naam}
              name="address"
              onChange={(event) => fetchAddressList(event.target.value)}
              autoComplete="off"
            />
            {showListBox && (
              <ComboboxOptions as={ListBox} modal={false}>
                {addressList.length > 0 ? (
                  addressList.map((test) => (
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
