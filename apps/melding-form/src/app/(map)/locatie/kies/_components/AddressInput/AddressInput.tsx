import type { ChangeEvent } from 'react'

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
import { useEffect, useMemo, useRef, useState } from 'react'

import { ListBox, TextInput } from '@meldingen/ui'

import type { PDOKItem } from './types'
import type { Coordinates } from '~/types'

import { convertWktPointToCoordinates } from '../../_utils/convertWktPointToCoordinates'
import { debounce } from './_utils/debounce'
import { fetchAddressList } from './_utils/fetchAddressList'
import { fetchAndSetAddress } from './_utils/fetchAndSetAddress'

import styles from './AddressInput.module.css'

export type Props = {
  coordinates?: Coordinates
  errorMessage?: string
  onAddressSelect: (coordinates: Coordinates) => void
}

export const AddressInput = ({ coordinates, errorMessage, onAddressSelect }: Props) => {
  // Keep track of the coordinates the label belongs to, so the label of previous coordinates is never submitted with new ones
  const [address, setAddress] = useState<{ coordinates?: Coordinates; label: string }>({ label: '' })
  const [addressList, setAddressList] = useState<PDOKItem[]>([])
  const [query, setQuery] = useState('')
  const [showListBox, setShowListBox] = useState(false)

  const addressListControllerRef = useRef<AbortController>(undefined)

  const t = useTranslations('select-location.combo-box')

  // Make sure the ComboboxOptions do not overflow the viewport
  const { floatingStyles, refs } = useFloating({
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
      setAddress({ label: '' })

      return
    }

    // Abort the request when coordinates change or are cleared, so a late response cannot overwrite the address
    const controller = new AbortController()

    fetchAndSetAddress({
      coordinates,
      setAddress: (label) => setAddress({ coordinates, label }),
      signal: controller.signal,
      t,
    })

    return () => controller.abort()
  }, [coordinates, t])

  useEffect(() => {
    setQuery(address.label)
  }, [address])

  const handleAddressSelect = (value: PDOKItem | string | null) => {
    if (typeof value === 'string' || value === null) {
      setQuery(value ?? '')
    } else {
      const addressCoordinates = convertWktPointToCoordinates(value.centroide_ll)

      if (addressCoordinates) onAddressSelect(addressCoordinates)

      setAddress({ coordinates: addressCoordinates, label: value.weergavenaam })
    }
  }

  // Memoized so the debounce timer survives rerenders, otherwise every keystroke would trigger a fetch
  const debouncedFetchAddressList = useMemo(
    () =>
      debounce((value: string, signal: AbortSignal) => {
        fetchAddressList({ setAddressList, setShowListBox, signal, value })
      }),
    [],
  )

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    // Abort the previous request immediately, so it cannot show the address list of an outdated query during the debounce
    addressListControllerRef.current?.abort()
    addressListControllerRef.current = new AbortController()

    setQuery(value)
    debouncedFetchAddressList(value, addressListControllerRef.current.signal)
  }

  // Only submit the coordinates while the input still shows the address they belong to.
  const hasUnchangedAddress = coordinates && coordinates === address.coordinates && query === address.label
  const coordinatesValue = hasUnchangedAddress ? JSON.stringify(coordinates) : ''

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
        key={address.label}
        onChange={handleAddressSelect}
        ref={refs.setReference}
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
            as={ListBox}
            className={styles.comboboxOptions}
            modal={false}
            ref={refs.setFloating}
            style={floatingStyles}
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
      <input name="coordinates" type="hidden" value={coordinatesValue} />
    </HUIField>
  )
}
