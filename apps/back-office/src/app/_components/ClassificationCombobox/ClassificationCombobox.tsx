'use client'

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
import { useState } from 'react'

import type { ClassificationOutput } from '@meldingen/api-client'

import { ListBox, TextInput } from '@meldingen/ui'

import styles from './ClassificationCombobox.module.css'

type Props = {
  classifications: ClassificationOutput[]
  defaultValue?: number
  errorMessage?: string
  label: string
  noResultsMessage: string
  placeholder?: string
}

const getClassificationById = (classifications: ClassificationOutput[], id?: number) =>
  classifications.find((classification) => classification.id === id)

const getClassificationByName = (classifications: ClassificationOutput[], name: string) =>
  classifications.find((classification) => classification.name === name)

export const ClassificationCombobox = ({
  classifications,
  defaultValue,
  errorMessage,
  label,
  noResultsMessage,
  placeholder,
}: Props) => {
  const [value, setValue] = useState(getClassificationById(classifications, defaultValue)?.name ?? '')

  // The input value is the source of truth, so typing an exact name counts as a selection too
  const selectedClassification = getClassificationByName(classifications, value)
  const hasErrorMessage = Boolean(errorMessage)

  const { floatingStyles, refs } = useFloating({
    middleware: [
      size({
        apply: ({ availableHeight, elements }) => {
          elements.floating.style.maxHeight = `${Math.max(0, availableHeight - 16)}px`
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  })

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
      <HUILabel as={Label}>{label}</HUILabel>
      {hasErrorMessage && <Description as={ErrorMessage}>{errorMessage}</Description>}
      <Combobox as="div" onChange={handleChange} ref={refs.setReference} value={selectedClassification ?? null}>
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
          as={ListBox}
          className={styles.comboboxOptions}
          modal={false}
          ref={refs.setFloating}
          style={floatingStyles}
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
        <Description className={styles.instructions}>{selectedClassification.instructions}</Description>
      )}
    </HUIField>
  )
}
