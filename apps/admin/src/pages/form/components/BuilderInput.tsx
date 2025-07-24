import { TextInput } from 'react-admin'
import { useFormContext } from 'react-hook-form'

import { FormBuilder } from '@meldingen/form-builder'

import styles from './BuilderInput.module.css'

export const BuilderInput = () => {
  const { getValues, setValue } = useFormContext()

  const data = getValues('components')

  const onChange = (schema: { components: unknown[] }) => {
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
        <FormBuilder data={data} onChange={onChange} />
      </div>
    </>
  )
}
