import type { ExtendedComponentSchema } from '@formio/js'
import { useEffect } from 'react'
import { TextInput } from 'react-admin'
import { useFormContext } from 'react-hook-form'

import { filterAttributes } from '../../../utils/filterAttributes'

type HiddenComponentsInputProps = {
  value?: any
  setBuilderJson?: any
}

export const HiddenComponentsInput = ({ value, setBuilderJson }: HiddenComponentsInputProps) => {
  const { getValues, setValue } = useFormContext()

  useEffect(() => {
    if (!value) {
      const inputValue = getValues('components')

      if (inputValue) {
        setBuilderJson(inputValue)
      }
    }
  }, [getValues, value, setBuilderJson])

  useEffect(() => {
    setValue('components', JSON.stringify(value))
  }, [setValue, value])

  return <TextInput source="components" />
}
