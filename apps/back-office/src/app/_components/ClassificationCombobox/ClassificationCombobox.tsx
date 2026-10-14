'use client'

import type { ChangeEvent, MouseEvent } from 'react'

import { ErrorMessage, Field, Label, Paragraph } from '@amsterdam/design-system-react'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Description,
  Field as HUIField,
  Label as HUILabel,
} from '@headlessui/react'
import { useRef, useState } from 'react'

import type { ClassificationOutput } from '@meldingen/api-client'

import { ListBox, TextInput } from '@meldingen/ui'

import styles from './ClassificationCombobox.module.css'

type Props = {
  classifications: ClassificationOutput[]
  defaultValue?: string
  errorMessage?: string
  isDisabled?: boolean
  label: string
  noResultsMessage: string
  placeholder?: string
}

const getClassificationByName = (classifications: ClassificationOutput[], name: string) =>
  classifications.find((classification) => classification.name === name)

export const ClassificationCombobox = ({
  classifications,
  defaultValue = '',
  errorMessage,
  isDisabled = false,
  label,
  noResultsMessage,
  placeholder,
}: Props) => {
  const [value, setValue] = useState(defaultValue)
  const [filterValue, setFilterValue] = useState('')
  const comboboxButtonRef = useRef<HTMLButtonElement>(null)

  // The input value is the source of truth, so typing an exact name counts as a selection too
  const selectedClassification = getClassificationByName(classifications, value)
  const hasErrorMessage = Boolean(errorMessage)

  const filteredClassifications =
    filterValue === ''
      ? classifications
      : classifications.filter((classification) =>
          classification.name.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()),
        )

  const handleChange = (classification: ClassificationOutput | null) => {
    if (!classification) return

    setValue(classification.name)
    setFilterValue('')
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    setFilterValue(event.target.value)
  }

  const handleInputClick = (event: MouseEvent<HTMLInputElement>) => {
    setFilterValue('')

    if (event.currentTarget.getAttribute('aria-expanded') === 'false') {
      comboboxButtonRef.current?.click()
    }
  }

  return (
    <HUIField as={Field} invalid={hasErrorMessage}>
      <HUILabel as={Label} htmlFor="classificationQuery">
        {label}
      </HUILabel>

      {hasErrorMessage && <Description as={ErrorMessage}>{errorMessage}</Description>}
      <Combobox as="div" onChange={handleChange} value={selectedClassification ?? null}>
        <input name="classificationId" type="hidden" value={selectedClassification?.id ?? ''} />
        <ComboboxButton hidden ref={comboboxButtonRef} />
        <ComboboxInput
          as={TextInput}
          autoComplete="off"
          className={styles.comboboxInput}
          disabled={isDisabled}
          id="classificationQuery"
          invalid={hasErrorMessage}
          name="classificationQuery"
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={placeholder}
          value={value}
        />
        <ComboboxOptions
          anchor={{ padding: 16, to: 'bottom start' }}
          as={ListBox}
          className={styles.comboboxOptions}
          modal={false}
        >
          {filteredClassifications.length > 0 ? (
            filteredClassifications.map((classification) => (
              <ComboboxOption as={ListBox.Option} key={classification.id} value={classification}>
                {classification.name}
              </ComboboxOption>
            ))
          ) : (
            <ComboboxOption as={ListBox.Option} disabled value={null}>
              {noResultsMessage}
            </ComboboxOption>
          )}
        </ComboboxOptions>
      </Combobox>

      {selectedClassification?.instructions && (
        <Description as={Paragraph} className={styles.instructions}>
          {selectedClassification.instructions}
        </Description>
      )}
    </HUIField>
  )
}
