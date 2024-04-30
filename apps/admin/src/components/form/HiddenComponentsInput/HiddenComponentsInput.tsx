import type { ComponentSchema } from '@formio/js'
import { useEffect } from 'react'
import { TextInput } from 'react-admin'
import { useFormContext } from 'react-hook-form'

type HiddenComponentsInputProps = {
  value?: ComponentSchema[]
  setInitialValue: (value: ComponentSchema[]) => void
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
      format={(val) => JSON.stringify(val)}
      hidden
    />
  )
}
