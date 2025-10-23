import { ErrorMessage, Field, Label } from '@amsterdam/design-system-react'
import { autoUpdate, size, useFloating } from '@floating-ui/react-dom'
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
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'

import { Feature } from '@meldingen/api-client'
import { ListBox, TextInput } from '@meldingen/ui'

import { PDOKItem } from './types'
import { debounce, fetchAddressList, fetchAndSetAddress } from './utils'
import { convertWktPointToCoordinates } from '../../_utils/convertWktPointToCoordinates'
import type { Coordinates } from 'apps/melding-form/src/types'

import styles from './AddressInput.module.css'

export type Props = {
  coordinates?: Coordinates
  errorMessage?: string
  setCoordinates: (coordinates?: Coordinates) => void
  setSelectedAssets: Dispatch<SetStateAction<Feature[]>>
}

export const AddressInput = ({ coordinates, errorMessage, setCoordinates, setSelectedAssets }: Props) => {
  const [address, setAddress] = useState('')
  const [query, setQuery] = useState('')
  const [addressList, setAddressList] = useState<PDOKItem[]>([])
  const [showListBox, setShowListBox] = useState(false)

  const t = useTranslations('select-location.combo-box')

  // Make sure the ComboboxOptions do not overflow the viewport
  const { refs, floatingStyles } = useFloating({
    middleware: [
      size({
        apply: ({ availableHeight, elements }) => {
          const value = `${Math.max(0, availableHeight - 16)}px`
          elements.floating.style.maxHeight = value
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

  useEffect(() => {
    if (!coordinates) {
      setAddress('')
      return
    }
    fetchAndSetAddress(coordinates, setAddress, t)
  }, [coordinates, t])

  useEffect(() => {
    setQuery(address)
  }, [address])

  const handleAddressSelect = (value: PDOKItem | string | null) => {
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
    }
  }

  // TODO: do we want to show a loading state?
  const debouncedFetchAddressList = debounce((value: string) => {
    fetchAddressList(value, setAddressList, setShowListBox)
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value === '') {
      setAddressList([])
      setCoordinates(undefined)
      return
    }

    setQuery(value)
    debouncedFetchAddressList(value)
  }

  return (
    <HUIField as={Field} invalid={!!errorMessage}>
      <HUILabel as={Label}>{t('label')}</HUILabel>
      {errorMessage && <Description as={ErrorMessage}>{errorMessage}</Description>}
      <Description className="ams-visually-hidden">
        {t.rich('description', { english: (chunks) => <span lang="en">{chunks}</span> })}
      </Description>
      <Combobox
        // Combobox does not rerender when address is set using keyboard on the Map, for some reason.
        // Setting the address as key makes sure it does.
        key={address}
        as="div"
        onChange={handleAddressSelect}
        value={query}
        className={styles.combobox}
        ref={refs.setReference}
      >
        <ComboboxInput as={TextInput} autoComplete="off" name="address" onChange={handleInputChange} />
        {showListBox && (
          <ComboboxOptions
            as={ListBox}
            className={styles.comboboxOptions}
            modal={false}
            ref={refs.setFloating}
            style={floatingStyles}
          >
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
      </Combobox>
    </HUIField>
  )
}
