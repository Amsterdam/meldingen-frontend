import { ErrorMessage, Field, Label, TextInput } from '@amsterdam/design-system-react'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Description,
  Field as HUIField,
  Label as HUILabel,
} from '@headlessui/react'
import { ListBox } from '@meldingen/ui'
import { useEffect, useState } from 'react'

import type { Address } from '../SideBar/SideBar'

const pdokQueryParams =
  'fq=bron:BAG&fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=id,weergavenaam,centroide_ll&rows=10'

// eslint-disable-next-line @typescript-eslint/ban-types
const debounce = (fn: Function, delay = 250) => {
  let timer: ReturnType<typeof setTimeout>

  return (...args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

type Props = {
  address: Address | null
  errorMessage: string | undefined
  setAddress: (address: Address | null) => void
}

export const AddressComboBox = ({ address, errorMessage, setAddress }: Props) => {
  const [query, setQuery] = useState('')
  const [addressList, setAddressList] = useState<Address[]>([])
  const [showListBox, setShowListBox] = useState(false)

  useEffect(() => {
    if (address?.weergave_naam) setQuery(address?.weergave_naam)
  }, [address])

  // TODO: do we want to show a loading state?
  const fetchAddressList = debounce(async (value: string) => {
    if (value.length >= 3) {
      try {
        const response = await fetch(
          `https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?${pdokQueryParams}&q=${value}`,
        )
        const responseData = await response.json()

        if (response.ok) {
          const responseList = responseData.response.docs.map(
            (item: { id: string; weergavenaam: string; centroide_ll: string }) => ({
              id: item.id,
              weergave_naam: item.weergavenaam,
              centroide_ll: item.centroide_ll,
            }),
          )

          setAddressList(responseList)
          setShowListBox(true)
        }
      } catch (error) {
        // TODO: do we want to show a message to the user here?
        // eslint-disable-next-line no-console
        console.error(error)
      }
    } else {
      setAddressList([])
      setShowListBox(false)
    }
  })

  const onChangeHandler = (value: Address | string | null) => {
    if (typeof value === 'string' || value === null) {
      setQuery(value ?? '')
    } else {
      setAddress({
        id: value.id,
        weergave_naam: value.weergave_naam,
        centroide_ll: value.centroide_ll,
      })
      setQuery(value.weergave_naam)
    }
  }

  return (
    <HUIField as={Field} invalid={!!errorMessage}>
      <HUILabel as={Label}>Zoek op adres</HUILabel>
      {errorMessage && <Description as={ErrorMessage}>{errorMessage}</Description>}
      <Description className="ams-visually-hidden">
        Als er autoaanvul-resultaten zijn, gebruik dan de pijltjes omhoog en omlaag om te bekijken en druk op enter om
        te kiezen. Voor <span lang="en">touch</span>-apparaten, verken met aanraking of veegbewegingen{' '}
        <span lang="en">(swipe)</span>.
      </Description>
      <Combobox as="div" onChange={onChangeHandler} onClose={() => fetchAddressList('')} value={query}>
        <ComboboxInput
          as={TextInput}
          autoComplete="off"
          name="address"
          onChange={(event) => {
            setQuery(event.target.value)
            fetchAddressList(event.target.value)
          }}
        />
        {showListBox && (
          <ComboboxOptions as={ListBox} modal={false}>
            {addressList.length > 0 ? (
              addressList.map((option) => (
                <ComboboxOption key={option.id} value={option} as={ListBox.Option}>
                  {option.weergave_naam}
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
    </HUIField>
  )
}
