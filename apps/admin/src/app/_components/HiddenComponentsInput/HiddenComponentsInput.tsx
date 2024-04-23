import { useEffect } from 'react'
import { TextInput } from 'react-admin'
import { useFormContext } from 'react-hook-form'

export const HiddenComponentsInput = ({ value }: { value: any }) => {
  const { setValue } = useFormContext()

  useEffect(() => {
    setValue('components', JSON.stringify(value))
  }, [setValue, value])

  return <TextInput source="components" hidden />
}
