'use client'

import type { ChangeEvent, FocusEvent } from 'react'

import { autoUpdate, size, useFloating } from '@floating-ui/react-dom'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'

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
  const [query, setQuery] = useState(defaultClassification?.name ?? '')
  const [hasPendingInput, setHasPendingInput] = useState(false)
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

  useEffect(() => {
    const nextClassification = getClassificationById(classifications, defaultValue)

    setHasPendingInput(false)
    setSelectedClassificationId(defaultValue ?? '')
    setQuery(nextClassification?.name ?? '')
  }, [classifications, defaultValue])

  const filteredClassifications =
    query === ''
      ? classifications
      : classifications.filter((classification) =>
          classification.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
        )

  const handleChange = (classification: ClassificationOutput | null) => {
    if (!classification) return

    setHasPendingInput(false)
    setSelectedClassificationId(String(classification.id))
    setQuery(classification.name)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHasPendingInput(true)
    setQuery(event.target.value)
  }

  const handleBlur = (_event: FocusEvent<HTMLInputElement>) => {
    if (!selectedClassificationId) {
      setHasPendingInput(false)

      return
    }

    if (!hasPendingInput) return

    const selectedClassification = getClassificationById(classifications, selectedClassificationId)

    if (selectedClassification) {
      setQuery(selectedClassification.name)
    }

    setHasPendingInput(false)
  }

  return (
    <Combobox as="div" className={styles.combobox} immediate nullable onChange={handleChange} ref={refs.setReference}>
      <input name={name} type="hidden" value={hasPendingInput ? '' : selectedClassificationId} />
      <ComboboxInput
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid}
        as={TextInput}
        autoComplete="off"
        className={clsx(styles.comboboxInput, invalid && styles.comboboxInputInvalid)}
        displayValue={(classification: ClassificationOutput | null) => classification?.name ?? query}
        id={id}
        invalid={invalid}
        name={`${name}-display`}
        onBlur={handleBlur}
        onChange={handleInputChange}
        placeholder={placeholder}
        value={query}
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
