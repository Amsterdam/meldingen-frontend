'use client'

import type { ChangeEvent, Ref } from 'react'

import { ErrorMessage, Field, Label, Paragraph } from '@amsterdam/design-system-react'
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
import { useImperativeHandle, useState } from 'react'

import type { ClassificationOutput } from '@meldingen/api-client'

import { ListBox, TextInput } from '@meldingen/ui'

import styles from './ClassificationCombobox.module.css'

export type ClassificationComboboxRef = {
  classification: string
  setClassification: (value: string) => void
}

type Props = {
  classifications: ClassificationOutput[]
  defaultValue?: string
  errorMessage?: string
  isDisabled?: boolean
  label: string
  noResultsMessage: string
  placeholder?: string
  ref?: Ref<ClassificationComboboxRef>
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
  ref,
}: Props) => {
  const [value, setValue] = useState(defaultValue)

  useImperativeHandle(
    ref,
    () => ({
      classification: value,
      setClassification: setValue,
    }),
    [value],
  )

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
      <HUILabel as={Label} htmlFor="classificationId">
        {label}
      </HUILabel>

      {hasErrorMessage && <Description as={ErrorMessage}>{errorMessage}</Description>}

      <Combobox as="div" onChange={handleChange} ref={refs.setReference} value={selectedClassification ?? null}>
        <input name="classificationId" type="hidden" value={selectedClassification?.id ?? ''} />
        <ComboboxInput
          as={TextInput}
          autoComplete="off"
          className={styles.comboboxInput}
          disabled={isDisabled}
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
        <Description as={Paragraph} className={styles.instructions}>
          {selectedClassification.instructions}
        </Description>
      )}
    </HUIField>
  )
}
