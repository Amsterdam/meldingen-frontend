'use client'

import type { ChangeEvent } from 'react'

import { ErrorMessage, Field, Label, Paragraph } from '@amsterdam/design-system-react'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Description,
  Field as HUIField,
  Label as HUILabel,
} from '@headlessui/react'
import { useState } from 'react'

import type { ClassificationOutput } from '@meldingen/api-client'

import { ListBox, TextInput } from '@meldingen/ui'

import styles from './ClassificationCombobox.module.css'

type Props = {
  classifications: ClassificationOutput[]
  defaultValue?: string
  errorMessage?: string
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
  label,
  noResultsMessage,
  placeholder,
}: Props) => {
  const [value, setValue] = useState(defaultValue)

  // The input value is the source of truth, so typing an exact name counts as a selection too
  const selectedClassification = getClassificationByName(classifications, value)
  const hasErrorMessage = Boolean(errorMessage)

  const filteredClassifications =
    value === ''
      ? classifications
      : classifications.filter((classification) =>
          classification.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
        )

  const handleChange = (classification: ClassificationOutput | null) => {
    if (!classification) return

    setValue(classification.name)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <HUIField as={Field} className="ams-mb-m" invalid={hasErrorMessage}>
      <HUILabel as={Label} htmlFor="classificationId">
        {label}
      </HUILabel>
      {hasErrorMessage && <Description as={ErrorMessage}>{errorMessage}</Description>}
      <Combobox as="div" className={styles.combobox} onChange={handleChange} value={selectedClassification ?? null}>
        <input name="classificationId" type="hidden" value={selectedClassification?.id ?? ''} />
        <ComboboxInput
          as={TextInput}
          autoComplete="off"
          className={styles.comboboxInput}
          id="classificationId"
          invalid={hasErrorMessage}
          name="classificationQuery"
          onChange={handleInputChange}
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
