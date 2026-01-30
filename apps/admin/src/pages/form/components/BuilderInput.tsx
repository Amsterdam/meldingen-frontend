import { ContainerComponent } from '@formio/core'
import { TextInput } from 'react-admin'
import { useFormContext } from 'react-hook-form'

import { FormBuilder } from '@meldingen/form-builder'

import { validateObjType } from '../../types'

import styles from './BuilderInput.module.css'

const parseJsonLogicRules = (rule: Record<string, unknown>) => {
  if (!rule || !Array.isArray(rule.if)) return {}

  let validateData = {} as validateObjType

  const [condition, nestedRule, errorMessage] = rule.if

  // Parse minLength rule from JsonLogic
  if (condition['>=']) {
    const [, minLength] = condition['>=']

    validateData = {
      ...validateData,
      minLength,
      minLengthErrorMessage: errorMessage,
    }
  }

  // Parse maxLength rule from JsonLogic
  if (nestedRule.if !== undefined) {
    const [secondCondition, , secondErrorMessage] = nestedRule.if

    const [, maxLength] = secondCondition['<=']

    validateData = {
      ...validateData,
      maxLength,
      maxLengthErrorMessage: secondErrorMessage,
    }
  }

  if (validateData?.json === '') {
    delete validateData.json
  }

  return validateData
}

const mapJsonLogicValidationsToFormData = (panels: ContainerComponent[]) =>
  panels.map((panel) => ({
    ...panel,
    components: panel.components.map((component) => {
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

  const panelComponents = getValues('components')

  // Parse JsonLogic rules to prefill validation fields in the form builder
  const PanelComponentsWithFormData = panelComponents && mapJsonLogicValidationsToFormData(panelComponents)

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
        <FormBuilder data={PanelComponentsWithFormData} onChange={onChange} />
      </div>
    </>
  )
}
