import { ErrorMessage, Field, Label, TextInput } from '@amsterdam/design-system-react'
import {
  Combobox as HUICombobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Description,
  Field as HUIField,
  Label as HUILabel,
} from '@headlessui/react'
import { ListBox } from '@meldingen/ui'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import type { Coordinates } from 'apps/public/src/types'

import { convertWktPointToCoordinates } from '../../_utils/convertWktPointToCoordinates'
import type { Address } from '../SideBar/SideBar'

import styles from './Combobox.module.css'

const pdokQueryParams =
  'fq=bron:BAG&fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=id,weergavenaam,centroide_ll&rows=7'

const debounce = (fn: Function, delay = 250) => {
  let timer: ReturnType<typeof setTimeout>

  return (...args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

type Props = {
  address?: Address
  errorMessage?: string
  setAddress: (address?: Address) => void
  setCoordinates: (coordinates: Coordinates) => void
}

export const Combobox = ({ address, errorMessage, setAddress, setCoordinates }: Props) => {
  const [query, setQuery] = useState('')
  const [addressList, setAddressList] = useState<Address[]>([])
  const [showListBox, setShowListBox] = useState(false)

  const t = useTranslations('select-location.combo-box')

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

  const onChangeHandler = (value: (Address & { centroide_ll: string }) | string | null) => {
    if (typeof value === 'string' || value === null) {
      setQuery(value ?? '')
    } else {
      setAddress({
        id: value.id,
        weergave_naam: value.weergave_naam,
      })
      setCoordinates(convertWktPointToCoordinates(value.centroide_ll))
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
