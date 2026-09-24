'use client'

import type { ChangeEvent } from 'react'

import { autoUpdate, size, useFloating } from '@floating-ui/react-dom'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { clsx } from 'clsx'
import { useState } from 'react'

import type { ClassificationOutput } from '@meldingen/api-client'

import { ListBox, TextInput } from '@meldingen/ui'

import styles from './ClassificationCombobox.module.css'

type Props = {
  ariaDescribedBy?: string
  classifications: ClassificationOutput[]
  defaultValue?: string
  id: string
  invalid?: boolean
  name: string
  noResultsMessage: string
  placeholder?: string
}

const getClassificationById = (classifications: ClassificationOutput[], id?: string) =>
  classifications.find((classification) => String(classification.id) === id)

export const ClassificationCombobox = ({
  ariaDescribedBy,
  classifications,
  defaultValue,
  id,
  invalid = false,
  name,
  noResultsMessage,
  placeholder,
}: Props) => {
  const defaultClassification = getClassificationById(classifications, defaultValue)
  const [value, setValue] = useState(defaultClassification?.name ?? '')
  const [selectedClassificationId, setSelectedClassificationId] = useState(defaultValue ?? '')

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

    setSelectedClassificationId(String(classification.id))
    setValue(classification.name)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Combobox
      as="div"
      className={styles.combobox}
      immediate
      onChange={handleChange}
      ref={refs.setReference}
      value={getClassificationById(classifications, selectedClassificationId) ?? null}
    >
      <input name={name} type="hidden" value={selectedClassificationId} />
      <ComboboxInput
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid}
        aria-required
        as={TextInput}
        autoComplete="off"
        className={clsx(styles.comboboxInput, invalid && styles.comboboxInputInvalid)}
        displayValue={(classification: ClassificationOutput | null) => classification?.name ?? value}
        id={id}
        invalid={invalid}
        name={`${name}-display`}
        onChange={handleInputChange}
        placeholder={placeholder}
        value={value}
      />
      <ComboboxOptions
        as={ListBox}
        className={clsx(styles.comboboxPopover, styles.comboboxResults)}
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
  )
}
