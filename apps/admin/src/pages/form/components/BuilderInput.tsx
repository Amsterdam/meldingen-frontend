import { TextInput } from 'react-admin'
import { useFormContext } from 'react-hook-form'

import { FormBuilder } from '@meldingen/form-builder'

import styles from './BuilderInput.module.css'

const parseJsonLoginRules = (rule) => {
  if (!rule || !Array.isArray(rule.if)) return null

  const [condition, , errorMessage] = rule.if

  if (condition['>=']) {
    const [, minLength] = condition['>=']

    return {
      minLength,
      minLengthErrorMessage: errorMessage,
    }
  }

  if (condition['<=']) {
    const [, maxLength] = condition['<=']

    return {
      maxLength,
      maxLengthErrorMessage: errorMessage,
    }
  }

  return null
}

const mapJsonLogicValidationsToFormFields = (data) =>
  data.map((page) => ({
    ...page,
    components: page.components.map((component) => {
      const validationData = parseJsonLoginRules(component.validate?.json)

      if (validationData) {
        return {
          ...component,
          validate: {
            ...component.validate,
            ...validationData,
          },
        }
      }

      return component
    }),
  }))

export const BuilderInput = () => {
  const { getValues, setValue } = useFormContext()

  const data = getValues('components')
  console.log('--- ~ data check dit:', data)
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
