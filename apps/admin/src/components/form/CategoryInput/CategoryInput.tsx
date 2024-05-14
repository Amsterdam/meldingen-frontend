import { useEffect, useState } from 'react'
import type { AutocompleteInputProps } from 'react-admin'
import { AutocompleteInput, Confirm, ReferenceInput, useRecordContext } from 'react-admin'
import { useFormContext } from 'react-hook-form'

const OptionRenderer = () => {
  const record = useRecordContext()
  return (
    <span>
      {record.name}
      {record.form_id && ' GEKOPPELD'}
    </span>
  )
}

const inputText = (choice) => `${choice.name}`

export const CategoryInput = () => {
  const [selectedValue, setSelectedValue] = useState({ value: undefined, form_id: undefined })
  const [previousSelectedValue, setPreviousSelectedValue] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [autocompleteOpen, setAutocompleteOpen] = useState(false)

  const { setValue } = useFormContext()

  useEffect(() => {
    if (selectedValue.form_id) {
      setDialogOpen(true)
    } else {
      setPreviousSelectedValue(selectedValue.value)
    }
  }, [selectedValue, setPreviousSelectedValue])

  const handleDialogClose = () => {
    setValue('classification', previousSelectedValue)
    setDialogOpen(false)
  }

  const handleDialogConfirm = () => {
    // functie om classification van andere form op undefined te zetten (oid)
    setPreviousSelectedValue(selectedValue.value)
    setDialogOpen(false)
  }

  // Zie ook https://marmelab.com/react-admin/Confirm.html#usage
  // https://marmelab.com/react-admin/AutocompleteInput.html#onchange
  // https://stackoverflow.com/questions/72263148/how-to-set-input-value-base-on-usestate-in-react-admin-v4

  // TODO: autcomplete open werkt nog niet helemaal lekker. Waarschijnlijk zit er iets van open on focus op?

  const handleChange: AutocompleteInputProps['onChange'] = (value, record) => {
    setSelectedValue({
      value,
      form_id: record?.form_id,
    })
  }

  return (
    <>
      <ReferenceInput source="classification" reference="classification">
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
