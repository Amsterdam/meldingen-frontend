import { TextInput } from 'react-admin'
import { useFormContext } from 'react-hook-form'

import type { FormioSchema } from '../../../../../../libs/formio/src/types/formio'
import { FormBuilder } from '@meldingen/formio'

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
        <FormBuilder data={initialValue} onChange={onChange} />
      </div>
    </>
  )
}
