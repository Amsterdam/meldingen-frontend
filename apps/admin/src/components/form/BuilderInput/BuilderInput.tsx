import { TextInput } from 'react-admin'
import { useFormContext } from 'react-hook-form'

import type { FormioSchema } from '../../../types/formio'
import { Builder } from '../Builder'

import styles from './BuilderInput.module.css'

export const BuilderInput = () => {
  const { getValues, setValue } = useFormContext()

  const initialValue = getValues('components')

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
        <Builder data={initialValue} onChange={onChange} />
      </div>
    </>
  )
}
