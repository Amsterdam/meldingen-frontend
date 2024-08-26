import { TextInput } from 'react-admin'
import { useFormContext } from 'react-hook-form'

import type { FormioSchema } from '@meldingen/formio'
import { FormBuilder } from '@meldingen/formio'

import styles from './BuilderInput.module.css'
import { useEffect, useState } from 'react'
import { ComponentSchema } from 'formiojs'

export const BuilderInput = () => {
  const [formValue, setFormValue] = useState<ComponentSchema[]>()

  const { getValues, setValue } = useFormContext()

  useEffect(() => {
    const initialValue = getValues('components')

    setFormValue(initialValue)
  }, [])

  const onChange = (schema: FormioSchema) => {
    setValue('components', schema?.components)
    setFormValue(schema?.components)
  }

  return (
    <>
      <TextInput
        defaultValue={[]}
        source="components"
        parse={(val) => JSON.parse(val)}
        format={(val) => JSON.stringify(val)}
        hidden
      />
      <div className={styles.builder}>
        <FormBuilder data={formValue} onChange={onChange} />
      </div>
    </>
  )
}
