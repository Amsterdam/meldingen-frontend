import type { ComponentSchema } from 'formiojs'
import { useEffect } from 'react'
import { TextInput } from 'react-admin'
import { useFormContext } from 'react-hook-form'

type HiddenComponentsInputProps = {
  value?: ComponentSchema[]
  setInitialValue: (value: ComponentSchema[]) => void
}

// TODO: This function filters the keys 'position' and 'question' from the API response.
// These keys should be removed from the API response, after which this function can be removed.
const tempReplacerFn = (key: string, value: any) => {
  if (key === 'position' || key === 'question') return undefined
  return value
}

export const HiddenComponentsInput = ({ value, setInitialValue }: HiddenComponentsInputProps) => {
  const { getValues, setValue } = useFormContext()

  useEffect(() => {
    if (!value) {
      const inputValue = getValues('components')

      if (inputValue) {
        setInitialValue(inputValue)
      }
    }
  }, [getValues, value, setInitialValue])

  useEffect(() => {
    setValue('components', value)
  }, [setValue, value])

  return (
    <TextInput
      defaultValue=""
      source="components"
      parse={(val) => JSON.parse(val)}
      format={(val) => JSON.stringify(val, tempReplacerFn)}
      hidden
    />
  )
}
