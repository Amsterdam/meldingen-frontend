import type { AutocompleteInputProps, RaRecord } from 'react-admin'

import { Icon } from '@amsterdam/design-system-react'
import { PowerPlugWithSocketIcon } from '@amsterdam/design-system-react-icons'
import { useEffect, useState } from 'react'
import { AutocompleteInput, Confirm, useGetList, useRecordContext } from 'react-admin'
import { useFormContext } from 'react-hook-form'

import styles from './ClassificationInput.module.css'

const OptionRenderer = () => {
  const record = useRecordContext()

  if (!record) return undefined

  return (
    <span className={styles.autoCompleteOption}>
      <span>{record.name}</span>
      {record.form && <Icon className={styles.autoCompleteOptionIcon} svg={PowerPlugWithSocketIcon} />}
    </span>
  )
}

const inputText = (choice: RaRecord) => `${choice.name}`

export const ClassificationInput = () => {
  const { data, isLoading } = useGetList('classification', {
    meta: {
      limit: 2000,
    },
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'name', order: 'ASC' },
  })

  const [stableChoices, setStableChoices] = useState<RaRecord[]>([])

  useEffect(() => {
    if (data && data.length > 0) {
      setStableChoices(data)
    }
  }, [data])

  const record = useRecordContext()
  const { getValues, setValue } = useFormContext()

  const [previousSelectedValue, setPreviousSelectedValue] = useState(record?.classification)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [autocompleteOpen, setAutocompleteOpen] = useState(false)

  const handleDialogClose = () => {
    setValue('classification', previousSelectedValue)
    setDialogOpen(false)
  }

  const handleDialogConfirm = () => {
    const selectedValue = getValues('classification')
    setPreviousSelectedValue(selectedValue)
    setDialogOpen(false)
  }

  const handleChange: AutocompleteInputProps['onChange'] = (value, classificationRecord) => {
    if (typeof classificationRecord === 'object' && classificationRecord?.form) {
      setDialogOpen(true)
    } else {
      setPreviousSelectedValue(value)
    }
  }

  return (
    <>
      <AutocompleteInput
        choices={stableChoices}
        inputText={inputText}
        isLoading={isLoading}
        matchSuggestion={(filterValue, choice) => choice.name?.toLowerCase().includes(filterValue.toLowerCase())}
        onChange={handleChange}
        onClose={() => setAutocompleteOpen(false)}
        onOpen={() => {
          if (!dialogOpen) setAutocompleteOpen(true)
        }}
        open={autocompleteOpen}
        openOnFocus={false}
        optionText={<OptionRenderer />}
        source="classification"
      />
      <Confirm
        content="ma.dialog.overwriteClassification.content"
        isOpen={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
        title="ma.dialog.overwriteClassification.title"
      />
    </>
  )
}
