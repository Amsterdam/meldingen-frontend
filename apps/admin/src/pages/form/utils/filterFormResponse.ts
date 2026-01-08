import type { BaseComponent, Component } from '@formio/core'

import filter from 'uber-json-schema-filter'

import type { FormInput } from '@meldingen/api-client'

import {
  FormCheckboxComponentInputSchema,
  FormComponentInputValidateSchema,
  FormInputSchema,
  FormPanelComponentInputSchema,
  FormRadioComponentInputSchema,
  FormSelectComponentInputSchema,
  FormTextAreaComponentInputSchema,
  FormTextFieldComponentInputSchema,
} from '@meldingen/api-client'

import type { AdditionalQuestionsForm } from '../../types'

const filterBySchemaPerType = (obj: Component) => {
  switch (obj.type) {
    case 'panel':
      return filter(FormPanelComponentInputSchema, obj)
    case 'radio':
      return filter(FormRadioComponentInputSchema, obj)
    case 'select':
      return filter(FormSelectComponentInputSchema, obj)
    case 'selectboxes':
      return filter(FormCheckboxComponentInputSchema, obj)
    case 'textarea':
      // Add autoExpand to object if it doesn't exist, the builder doesn't do that by default
      if (!Object.hasOwn(obj, 'autoExpand')) {
        return filter(FormTextAreaComponentInputSchema, { ...obj, autoExpand: false })
      }

      return filter(FormTextAreaComponentInputSchema, obj)
    case 'textfield':
      return filter(FormTextFieldComponentInputSchema, obj)
    default:
      throw Error(`Type ${obj.type} is unknown, please add it to filterFormResponse.`)
  }
}

const getFilteredValidateObject = (validateObj: BaseComponent['validate']) => {
  const validate = filter(FormComponentInputValidateSchema, validateObj)

  // Explicitly remove the 'json' key if its value is an empty string, the API doesn't accept that
  if (validate?.json === '') {
    delete validate.json
  }

  return validate
}

export const filterFormResponse = (obj: AdditionalQuestionsForm): FormInput => {
  // This function is used to filter an additional questions form, which is always
  // a wizard with panels containing questions. Therefore the form has a fixed depth of two levels.
  const firstLevelComponents = obj.components.map((firstLevelComponent) => {
    const secondLevelComponents = firstLevelComponent.components.map((secondLevelComponent) => ({
      ...filterBySchemaPerType(secondLevelComponent),
      validate: getFilteredValidateObject(secondLevelComponent.validate),
    }))

    const filteredObject = {
      ...filterBySchemaPerType(firstLevelComponent),
      components: secondLevelComponents,
      validate: getFilteredValidateObject(firstLevelComponent.validate),
    }

    // Explicitly remove the 'validate' key for panel components, the API doesn't accept that
    if (filteredObject.type === 'panel') {
      delete filteredObject.validate
    }

    return filteredObject
  })

  return {
    ...filter(FormInputSchema, obj),
    components: firstLevelComponents,
  }
}
