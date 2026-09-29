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
  name: string
  noResultsMessage: string
  placeholder?: string
}

const getClassificationById = (classifications: ClassificationOutput[], id?: number) =>
  classifications.find((classification) => classification.id === id)

export const ClassificationCombobox = ({
  classifications,
  defaultValue,
  errorMessage,
  label,
  name,
  noResultsMessage,
  placeholder,
}: Props) => {
  const [selectedClassificationId, setSelectedClassificationId] = useState(defaultValue)
  const selectedClassification = getClassificationById(classifications, selectedClassificationId)
  const [value, setValue] = useState(selectedClassification?.name ?? '')
  const hasErrorMessage = Boolean(errorMessage)
  const isValidClassificationName = value === (selectedClassification?.name ?? '')

  const { floatingStyles, refs } = useFloating({
    middleware: [
      size({
        apply: ({ availableHeight, elements, rects }) => {
          elements.floating.style.maxHeight = `${Math.max(0, availableHeight - 16)}px`
          elements.floating.style.width = `${rects.reference.width}px`
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

    setSelectedClassificationId(classification.id)
    setValue(classification.name)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <HUIField as={Field} className="ams-mb-m" invalid={Boolean(errorMessage)}>
      <HUILabel as={Label}>{label}</HUILabel>
      {errorMessage && <Description as={ErrorMessage}>{errorMessage}</Description>}
      <Combobox as="div" onChange={handleChange} ref={refs.setReference} value={selectedClassification}>
        <input name={name} type="hidden" value={isValidClassificationName ? selectedClassificationId : ''} />
        <ComboboxInput
          as={TextInput}
          className={styles.comboboxInput}
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
