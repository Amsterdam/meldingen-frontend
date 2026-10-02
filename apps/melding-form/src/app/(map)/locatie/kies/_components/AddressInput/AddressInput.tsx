import type { ChangeEvent } from 'react'

import { ErrorMessage, Field, Label } from '@amsterdam/design-system-react'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Description,
  Field as HUIField,
  Label as HUILabel,
} from '@headlessui/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { ListBox, TextInput } from '@meldingen/ui'

import type { PDOKItem } from './types'
import type { Coordinates } from '~/types'

import { convertWktPointToCoordinates } from '../../_utils/convertWktPointToCoordinates'
import { debounce } from './_utils/debounce'
import { fetchAddressList } from './_utils/fetchAddressList'
import { fetchAndSetAddress } from './_utils/fetchAndSetAddress'

import styles from './AddressInput.module.css'

export type Props = {
  clearCoordinates: () => void
  coordinates?: Coordinates
  errorMessage?: string
  onAddressSelect: (coordinates: Coordinates) => void
}

export const AddressInput = ({ clearCoordinates, coordinates, errorMessage, onAddressSelect }: Props) => {
  const [address, setAddress] = useState('')
  const [addressList, setAddressList] = useState<PDOKItem[]>([])
  const [query, setQuery] = useState('')
  const [showListBox, setShowListBox] = useState(false)

  const t = useTranslations('select-location.combo-box')

  useEffect(() => {
    if (coordinates) fetchAndSetAddress({ coordinates, setAddress, t })
  }, [coordinates, t])

  useEffect(() => {
    setQuery(address)
  }, [address])

  const handleAddressSelect = (value: PDOKItem | string | null) => {
    if (typeof value === 'string' || value === null) {
      setQuery(value ?? '')
    } else {
      const addressCoordinates = convertWktPointToCoordinates(value.centroide_ll)

      if (addressCoordinates) onAddressSelect(addressCoordinates)

      setAddress(value.weergavenaam)
    }
  }

  const debouncedFetchAddressList = debounce((value: string) => {
    fetchAddressList({ setAddressList, setShowListBox, value })
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    // Clear coordinates on typing so submitting without selecting a valid address gives a validation error
    if (coordinates) clearCoordinates()

    if (value === '') {
      setAddressList([])

      return
    }

    setQuery(value)
    debouncedFetchAddressList(value)
  }

  return (
    <HUIField as={Field} invalid={Boolean(errorMessage)}>
      <HUILabel as={Label}>{t('label')}</HUILabel>
      {errorMessage && <Description as={ErrorMessage}>{errorMessage}</Description>}
      <Description className="ams-visually-hidden">
        {t.rich('description', { english: (chunks) => <span lang="en">{chunks}</span> })}
      </Description>
      <Combobox
        as="div"
        className={styles.combobox}
        // Combobox does not rerender when address is set using keyboard on the Map, for some reason.
        // Setting the address as key makes sure it does.
        key={address}
        onChange={handleAddressSelect}
        value={query}
      >
        <ComboboxInput
          aria-required="true"
          as={TextInput}
          autoComplete="off"
          name="address"
          onChange={handleInputChange}
        />
        {showListBox && (
          <ComboboxOptions
            anchor={{ padding: 16, to: 'bottom start' }}
            as={ListBox}
            className={styles.comboboxOptions}
            modal={false}
          >
            {addressList.length > 0 ? (
              addressList.map((option) => (
                <ComboboxOption as={ListBox.Option} key={option.id} value={option}>
                  {option.weergavenaam}
                </ComboboxOption>
              ))
            ) : (
              <ComboboxOption as={ListBox.Option} disabled value="">
                {t('no-results')}
              </ComboboxOption>
            )}
          </ComboboxOptions>
        )}
      </Combobox>
    </HUIField>
  )
}
