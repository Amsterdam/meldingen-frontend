'use client'

import type { KeyboardEvent } from 'react'

import clsx from 'clsx'
import { useEffect, useId, useRef, useState } from 'react'

import type { ClassificationOutput } from '@meldingen/api-client'

import { ListBox, TextInput } from '@meldingen/ui'

import styles from './ClassificationCombobox.module.css'

type Props = {
  ariaDescribedBy?: string
  classifications: ClassificationOutput[]
  defaultValue: string
  id: string
  invalid?: boolean
  name: string
  noResultsMessage: string
  onSelect?: (classification?: ClassificationOutput) => void
  placeholder: string
}

const getClassificationName = (classifications: ClassificationOutput[], classificationId: string) =>
  classifications.find(({ id: currentClassificationId }) => String(currentClassificationId) === classificationId)
    ?.name ?? ''

export const ClassificationCombobox = ({
  ariaDescribedBy,
  classifications,
  defaultValue,
  id,
  invalid = false,
  name,
  noResultsMessage,
  onSelect,
  placeholder,
}: Props) => {
  const defaultVisibleValue = getClassificationName(classifications, defaultValue)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [hasTyped, setHasTyped] = useState(false)
  const [inputValue, setInputValue] = useState(defaultVisibleValue)
  const [selectedClassificationId, setSelectedClassificationId] = useState(defaultValue)
  const comboboxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listBoxId = useId()
  const selectedClassificationName = getClassificationName(classifications, selectedClassificationId)
  const shouldFilter = hasTyped || !selectedClassificationName || inputValue !== selectedClassificationName
  const filteredClassifications = classifications.filter(({ name: classificationName }) =>
    shouldFilter ? classificationName.toLowerCase().includes(inputValue.trim().toLowerCase()) : true,
  )

  useEffect(() => {
    setSelectedClassificationId(defaultValue)
    setInputValue(defaultVisibleValue)
    setHasTyped(false)
    setIsOpen(false)
  }, [classifications, defaultValue, defaultVisibleValue])

  useEffect(() => {
    if (!isOpen) return

    const selectedIndex = classifications
      .filter(({ name: classificationName }) =>
        shouldFilter ? classificationName.toLowerCase().includes(inputValue.trim().toLowerCase()) : true,
      )
      .findIndex(({ id: currentClassificationId }) => String(currentClassificationId) === selectedClassificationId)

    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }, [classifications, inputValue, isOpen, selectedClassificationId, shouldFilter])

  useEffect(() => {
    if (!isOpen) return

    const handleMouseDown = (event: MouseEvent) => {
      if (comboboxRef.current?.contains(event.target as Node)) return

      restoreCommittedSelection()
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [isOpen])

  const restoreCommittedSelection = () => {
    setInputValue(selectedClassificationName)
    setHasTyped(false)
  }

  const closeCombobox = () => {
    setIsOpen(false)
  }

  const openCombobox = () => {
    setIsOpen(true)
  }

  const handleSelect = (classificationId: string) => {
    const selectedClassification = classifications.find(
      ({ id: currentClassificationId }) => String(currentClassificationId) === classificationId,
    )

    setSelectedClassificationId(classificationId)
    setInputValue(selectedClassification?.name ?? '')
    setHasTyped(false)
    onSelect?.(selectedClassification)
    closeCombobox()
    inputRef.current?.focus()
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      openCombobox()
      setActiveIndex((currentIndex) =>
        filteredClassifications.length === 0 ? 0 : Math.min(currentIndex + 1, filteredClassifications.length - 1),
      )
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      openCombobox()
      setActiveIndex((currentIndex) => Math.max(currentIndex - 1, 0))
      return
    }

    if (event.key === 'Enter') {
      if (!isOpen || filteredClassifications.length === 0) return

      event.preventDefault()
      handleSelect(String(filteredClassifications[activeIndex]?.id ?? filteredClassifications[0].id))
      return
    }

    if (event.key !== 'Escape') return

    event.preventDefault()
    closeCombobox()
  }

  return (
    <div
      className={styles.combobox}
      onBlurCapture={(event) => {
        if (comboboxRef.current?.contains(event.relatedTarget as Node | null)) return

        restoreCommittedSelection()
        closeCombobox()
      }}
      ref={comboboxRef}
    >
      <input name={name} type="hidden" value={selectedClassificationId} />
      <TextInput
        aria-activedescendant={isOpen ? `${listBoxId}-${filteredClassifications[activeIndex]?.id}` : undefined}
        aria-autocomplete="list"
        aria-controls={listBoxId}
        aria-describedby={ariaDescribedBy}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={invalid}
        className={clsx(styles.comboboxInput, { [styles.comboboxInputInvalid]: invalid })}
        id={id}
        name={`${name}Search`}
        onChange={(event) => {
          setInputValue(event.target.value)
          setHasTyped(true)
          openCombobox()
        }}
        onClick={openCombobox}
        onFocus={openCombobox}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        ref={inputRef}
        role="combobox"
        value={inputValue}
      />
      {isOpen && (
        <div className={styles.comboboxPopover}>
          <ListBox className={styles.comboboxResults} id={listBoxId} role="listbox">
            {filteredClassifications.length === 0 ? (
              <ListBox.Option aria-disabled="true">{noResultsMessage}</ListBox.Option>
            ) : (
              filteredClassifications.map((classification, index) => (
                <ListBox.Option
                  aria-selected={String(classification.id) === selectedClassificationId}
                  data-active={index === activeIndex ? true : undefined}
                  data-selected={String(classification.id) === selectedClassificationId ? true : undefined}
                  id={`${listBoxId}-${classification.id}`}
                  key={classification.id}
                  onClick={() => handleSelect(String(classification.id))}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                >
                  {classification.name}
                </ListBox.Option>
              ))
            )}
          </ListBox>
        </div>
      )}
    </div>
  )
}
