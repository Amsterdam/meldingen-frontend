import { useEffect } from 'react'
import { TextInput } from 'react-admin'
import { useFormContext } from 'react-hook-form'

type HiddenComponentsInputProps = {
  value?: any
  setInitialValue?: any
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
    setValue('components', JSON.stringify(value))
  }, [setValue, value])

  return <TextInput source="components" />
}
