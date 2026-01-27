import { ContainerComponent } from '@formio/core'
import { TextInput } from 'react-admin'
import { useFormContext } from 'react-hook-form'

import { FormBuilder } from '@meldingen/form-builder'

import styles from './BuilderInput.module.css'

const parseJsonLogicRules = (rule: Record<string, unknown>) => {
  if (!rule || !Array.isArray(rule.if)) return null

  let validateData = {}

  const [condition, secondRule, errorMessage] = rule.if

  if (condition['>=']) {
    const [, minLength] = condition['>=']

    validateData = {
      ...validateData,
      minLength,
      minLengthErrorMessage: errorMessage,
    }
  }

  const [secondCondition, , secondErrorMessage] = secondRule.if

  const [, maxLength] = secondCondition['<=']

  validateData = {
    ...validateData,
    maxLength,
    maxLengthErrorMessage: secondErrorMessage,
  }

  return validateData || null
}

const mapJsonLogicValidationsToFormFields = (data: ContainerComponent[]) =>
  data.map((page) => ({
    ...page,
    components: page.components.map((component) => {
      const validationData = parseJsonLogicRules(component.validate?.json)

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
