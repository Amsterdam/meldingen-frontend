import { useEffect, useState } from 'react'
import type { AutocompleteInputProps } from 'react-admin'
import { AutocompleteInput, ReferenceInput, useRecordContext } from 'react-admin'
import { useFormContext } from 'react-hook-form'

const OptionRenderer = () => {
  const record = useRecordContext()
  return (
    <span>
      {record.name}
      {record.form && ' GEKOPPELD'}
    </span>
  )
}

const inputText = (choice) => `${choice.name}`

export const CategoryInput = () => {
  const [selectedValue, setSelectedValue] = useState({ value: undefined, form: undefined }) // state met value
  const [dialogOpen, setDialogOpen] = useState(false) // state met confirm is open of niet

  const { setValue } = useFormContext()

  useEffect(() => {
    if (selectedValue.form) {
      setDialogOpen(true)
    }
  }, [selectedValue])

  console.log(dialogOpen)

  // useeffect:
  // als value verandert en category is niet gekoppeld, niks doen, value wordt automatisch geset
  // als value verandert en category is wel gekoppeld, open <Confirm />

  // const handleDialogClose = () => setOpen(false);
  // const handleConfirm = () => {
  //     // functie om classification van andere form op undefined te zetten (oid)
  //     // functie om classification van dit veld te setten met useFormContext
  //     setOpen(false);
  // };

  // Zie ook https://marmelab.com/react-admin/Confirm.html#usage
  // https://marmelab.com/react-admin/AutocompleteInput.html#onchange
  // https://stackoverflow.com/questions/72263148/how-to-set-input-value-base-on-usestate-in-react-admin-v4

  const handleChange: AutocompleteInputProps['onChange'] = (value, record) => {
    setSelectedValue({
      value,
      form: record?.form,
    })
  }

  return (
    <ReferenceInput source="classification" reference="classification">
      <AutocompleteInput inputText={inputText} optionText={<OptionRenderer />} onChange={handleChange} />
    </ReferenceInput>
  )
}
