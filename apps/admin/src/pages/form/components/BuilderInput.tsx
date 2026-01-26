import { TextInput } from 'react-admin'
import { useFormContext } from 'react-hook-form'

import { FormBuilder } from '@meldingen/form-builder'

import styles from './BuilderInput.module.css'

const parseMinLengthRule = (rule) => {
  if (!rule || !Array.isArray(rule.if)) return null

  const [condition, , errorMessage] = rule.if

  if (condition['>=']) {
    const [, minLength] = condition['>=']

    return {
      minLength,
      minLengthErrorMessage: errorMessage,
    }
  }

  return null
}

const mapJsonLogicValidationsToFormFields = (data) =>
  data.map((page) => ({
    ...page,
    components: page.components.map((component) => {
      const minLengthValidation = parseMinLengthRule(component.validate?.json)

      if (minLengthValidation) {
        return {
          ...component,
          validate: {
            ...component.validate,
            min_length: minLengthValidation.minLength,
            min_length_error_message: minLengthValidation.minLengthErrorMessage,
          },
        }
      }

      return component
    }),
  }))

export const BuilderInput = () => {
  const { getValues, setValue } = useFormContext()

  const data = getValues('components')
  const result = data && mapJsonLogicValidationsToFormFields(data)

  const onChange = (schema: { components: unknown[] }) => {
    setValue('components', schema?.components)
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
        <FormBuilder data={result} onChange={onChange} />
      </div>
    </>
  )
}
