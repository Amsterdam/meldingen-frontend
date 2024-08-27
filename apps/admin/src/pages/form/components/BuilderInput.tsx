import type { ComponentSchema } from 'formiojs'
import { useEffect, useState } from 'react'
import { TextInput } from 'react-admin'
import { useFormContext } from 'react-hook-form'

import type { FormioSchema } from '@meldingen/formio'
import { FormBuilder } from '@meldingen/formio'

import styles from './BuilderInput.module.css'

export const BuilderInput = () => {
  const [formValue, setFormValue] = useState<ComponentSchema[]>()

  const { getValues, setValue } = useFormContext()

  // This is undefined on first render, but it rerenders a couple of times.
  // That is why the useEffect is necessary.
  const formValueOnRender = getValues('components')

  useEffect(() => {
    setFormValue(formValueOnRender)
  }, [formValueOnRender])

  const onChange = (schema: FormioSchema) => {
    setValue('components', schema?.components)
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
