'use client'

import type { ChangeEvent, ComponentProps, ForwardedRef } from 'react'

import { autoUpdate, size, useFloating } from '@floating-ui/react-dom'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { forwardRef, useState } from 'react'

import type { ClassificationOutput } from '@meldingen/api-client'

import { Column, ListBox, Paragraph, TextInput } from '@meldingen/ui'

import styles from './ClassificationCombobox.module.css'

type Props = {
  ariaDescribedBy?: string
  classifications: ClassificationOutput[]
  defaultValue?: number
  id: string
  invalid?: boolean
  name: string
  noResultsMessage: string
  placeholder?: string
}

const getClassificationById = (classifications: ClassificationOutput[], id?: number) =>
  classifications.find((classification) => classification.id === id)

type ComboboxTextInputProps = ComponentProps<typeof TextInput> & {
  describedBy?: string
}

const ComboboxTextInput = forwardRef(
  ({ describedBy, ...props }: ComboboxTextInputProps, ref: ForwardedRef<HTMLInputElement>) => (
    <TextInput {...props} aria-describedby={describedBy} ref={ref} />
  ),
)

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
  const [selectedClassificationId, setSelectedClassificationId] = useState(defaultValue)
  const selectedClassification = getClassificationById(classifications, selectedClassificationId)
  const [value, setValue] = useState(selectedClassification?.name ?? '')

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
    <Column gap="small">
      <Combobox as="div" onChange={handleChange} ref={refs.setReference} value={selectedClassification}>
        <input name={name} type="hidden" value={selectedClassificationId} />
        <input name="isClassificationEmpty" type="hidden" value={value.length === 0 ? 'true' : 'false'} />
        <input
          name="isClassificationSelected"
          type="hidden"
          value={value === selectedClassification?.name ? 'true' : 'false'}
        />
        <ComboboxInput
          aria-invalid={invalid}
          aria-required
          as={ComboboxTextInput}
          autoComplete="off"
          className={styles.comboboxInput}
          describedBy={ariaDescribedBy}
          id={id}
          invalid={invalid}
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
      {selectedClassification?.instructions && <Paragraph>{selectedClassification.instructions}</Paragraph>}
    </Column>
  )
}
