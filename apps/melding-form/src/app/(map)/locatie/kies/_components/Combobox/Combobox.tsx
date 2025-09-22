import { ErrorMessage, Field, Label } from '@amsterdam/design-system-react'
import {
  Combobox as HUICombobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Description,
  Field as HUIField,
  Label as HUILabel,
} from '@headlessui/react'
import { useTranslations } from 'next-intl'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { Feature } from '@meldingen/api-client'
import { ListBox, TextInput } from '@meldingen/ui'

import { convertWktPointToCoordinates } from '../../_utils/convertWktPointToCoordinates'
import type { Coordinates } from 'apps/melding-form/src/types'

import styles from './Combobox.module.css'

const pdokQueryParams =
  'fq=bron:BAG&fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=id,weergavenaam,centroide_ll&rows=7'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const debounce = (fn: Function, delay = 250) => {
  let timer: ReturnType<typeof setTimeout>

  return (...args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export type Props = {
  address: string
  errorMessage?: string
  setAddress: (address: string) => void
  setCoordinates: (coordinates: Coordinates) => void
  setSelectedAssets: Dispatch<SetStateAction<Feature[]>>
}

type PDOKItem = {
  id: string
  weergave_naam: string
  centroide_ll: string
}

export const Combobox = ({ address, errorMessage, setAddress, setCoordinates, setSelectedAssets }: Props) => {
  const [query, setQuery] = useState('')
  const [addressList, setAddressList] = useState<PDOKItem[]>([])
  const [showListBox, setShowListBox] = useState(false)

  const t = useTranslations('select-location.combo-box')

  useEffect(() => {
    setQuery(address)
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
          const responseList: PDOKItem[] = responseData.response.docs.map(
            (item: { id: string; weergavenaam: string; centroide_ll: string }): PDOKItem => ({
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

  const onChangeHandler = (value: PDOKItem | string | null) => {
    if (typeof value === 'string' || value === null) {
      setQuery(value ?? '')
    } else {
      const coordinates = convertWktPointToCoordinates(value.centroide_ll)
      if (coordinates) {
        // Clear selected assets when selecting a new address
        setSelectedAssets([])
        setCoordinates(coordinates)
      }
      setAddress(value.weergave_naam)
      setQuery(value.weergave_naam)
    }
  }

  return (
    <HUIField as={Field} invalid={!!errorMessage}>
      <HUILabel as={Label}>{t('label')}</HUILabel>
      {errorMessage && <Description as={ErrorMessage}>{errorMessage}</Description>}
      <Description className="ams-visually-hidden">
        {t.rich('description', { english: (chunks) => <span lang="en">{chunks}</span> })}
      </Description>
      <HUICombobox
        // Combobox does not rerender when address is set using keyboard on the Map, for some reason.
        // Setting the address as key makes sure it does.
        key={address}
        as="div"
        onChange={onChangeHandler}
        onClose={() => fetchAddressList('')}
        value={query}
        className={styles.combobox}
      >
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
          <ComboboxOptions as={ListBox} className={styles.comboboxOptions} modal={false}>
            {addressList.length > 0 ? (
              addressList.map((option) => (
                <ComboboxOption key={option.id} value={option} as={ListBox.Option}>
                  {option.weergave_naam}
                </ComboboxOption>
              ))
            ) : (
              <ComboboxOption value="" disabled as={ListBox.Option}>
                {t('no-results')}
              </ComboboxOption>
            )}
          </ComboboxOptions>
        )}
      </HUICombobox>
    </HUIField>
  )
}
