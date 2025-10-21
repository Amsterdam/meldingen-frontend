import { useState } from 'react'
import { AutocompleteInput, type RaRecord, ReferenceInput, useRecordContext } from 'react-admin'
import { useFormContext } from 'react-hook-form'

const inputText = (choice: RaRecord) => `${choice.name}`

const OptionRenderer = () => {
  const record = useRecordContext()

  if (!record) return undefined

  return <span>{record.name}</span>
}

export const AssetTypeInput = () => {
  const { setValue } = useFormContext()
  const [autocompleteOpen, setAutocompleteOpen] = useState(false)

  return (
    <ReferenceInput reference="asset-type" sort={{ field: 'name', order: 'ASC' }} source="asset_type">
      <AutocompleteInput
        open={autocompleteOpen}
        onOpen={() => {
          setAutocompleteOpen(true)
        }}
        onClose={() => {
          setAutocompleteOpen(false)
        }}
        openOnFocus={false}
        inputText={inputText}
        optionText={<OptionRenderer />}
        onChange={(value) => setValue('asset-type', value)}
      />
    </ReferenceInput>
  )
}
