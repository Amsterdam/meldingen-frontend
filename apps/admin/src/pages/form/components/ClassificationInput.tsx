import { Icon } from '@amsterdam/design-system-react'
import { PowerPlugWithSocketIcon } from '@amsterdam/design-system-react-icons'
import { useState } from 'react'
import type { AutocompleteInputProps, RaRecord } from 'react-admin'
import { AutocompleteInput, Confirm, ReferenceInput, useRecordContext } from 'react-admin'
import { useFormContext } from 'react-hook-form'

import styles from './ClassificationInput.module.css'

const OptionRenderer = () => {
  const record = useRecordContext()

  if (!record) return undefined

  return (
    <span className={styles.autoCompleteOption}>
      <span>{record.name}</span>
      {record.form && <Icon svg={PowerPlugWithSocketIcon} className={styles.autoCompleteOptionIcon} />}
    </span>
  )
}

const inputText = (choice: RaRecord) => `${choice.name}`

export const ClassificationInput = () => {
  const record = useRecordContext()
  const { setValue, getValues } = useFormContext()

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
      <ReferenceInput reference="classification" sort={{ field: 'name', order: 'ASC' }} source="classification">
        <AutocompleteInput
          open={autocompleteOpen}
          onOpen={() => {
            if (!dialogOpen) {
              setAutocompleteOpen(true)
            }
          }}
          onClose={() => {
            setAutocompleteOpen(false)
          }}
          openOnFocus={false}
          inputText={inputText}
          optionText={<OptionRenderer />}
          onChange={handleChange}
        />
      </ReferenceInput>
      <Confirm
        isOpen={dialogOpen}
        title="ma.dialog.overwriteClassification.title"
        content="ma.dialog.overwriteClassification.content"
        onConfirm={handleDialogConfirm}
        onClose={handleDialogClose}
      />
    </>
  )
}
