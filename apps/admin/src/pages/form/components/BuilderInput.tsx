import type { Component } from '@formio/core'

import { TextInput } from 'react-admin'
import { useFormContext, useWatch } from 'react-hook-form'

import { FormBuilder } from '@meldingen/form-builder'

import styles from './BuilderInput.module.css'

export const BuilderInput = () => {
  const { control, setValue } = useFormContext()
  const data = useWatch({ control, defaultValue: [], name: 'components' })

  const onChange = (schema: { components: Component[] }) => {
    setValue('components', schema?.components ?? [])
  }

  return (
    <>
      <TextInput
        defaultValue={[]}
        format={(val) => JSON.stringify(val)}
        hidden
        parse={(val) => JSON.parse(val)}
        source="components"
      />
      <div className={styles.builder}>
        <FormBuilder data={data} onChange={onChange} />
      </div>
    </>
  )
}
