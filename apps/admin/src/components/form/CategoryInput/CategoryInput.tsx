import { Icon } from '@amsterdam/design-system-react'
import { ApiIcon } from '@amsterdam/design-system-react-icons'
import { useState } from 'react'
import type { AutocompleteInputProps, RaRecord } from 'react-admin'
import { AutocompleteInput, Confirm, ReferenceInput, useRecordContext } from 'react-admin'
import { useFormContext } from 'react-hook-form'

import styles from './CategoryInput.module.css'

const OptionRenderer = () => {
  const record = useRecordContext()
  return (
    <span className={styles.autoCompleteOption}>
      <span>{record.name}</span>
      {record.form_id && <Icon size="level-5" svg={ApiIcon} className={styles.autoCompleteOptionIcon} />}
    </span>
  )
}

const inputText = (choice: RaRecord) => `${choice.name}`

export const CategoryInput = () => {
  const record = useRecordContext()
  const { setValue, getValues } = useFormContext()

  const [previousSelectedValue, setPreviousSelectedValue] = useState(record.classification_id)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [autocompleteOpen, setAutocompleteOpen] = useState(false)

  const handleDialogClose = () => {
    setValue('classification_id', previousSelectedValue)
    setDialogOpen(false)
  }

  const handleDialogConfirm = () => {
    const selectedValue = getValues('classification_id')
    setPreviousSelectedValue(selectedValue)
    setDialogOpen(false)
  }

  const handleChange: AutocompleteInputProps['onChange'] = (value, classificationRecord) => {
    if (typeof classificationRecord === 'object' && classificationRecord?.form_id) {
      setDialogOpen(true)
    } else {
      setPreviousSelectedValue(value)
    }
  }

  return (
    <>
      <ReferenceInput source="classification_id" reference="classification">
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
        title="Ontkoppel bestaande vragenlijst"
        content="Hier haal je de gekoppelde vragenlijst offline en zet je de huidige vragenlijst online. Is dat wat je wilt?"
        onConfirm={handleDialogConfirm}
        onClose={handleDialogClose}
      />
    </>
  )
}
