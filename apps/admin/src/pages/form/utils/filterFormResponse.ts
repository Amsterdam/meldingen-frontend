import {
  $FormCheckboxComponentInput,
  $FormComponentInputValidate,
  $FormInput,
  $FormPanelComponentInput,
  $FormRadioComponentInput,
  $FormSelectComponentInput,
  $FormTextAreaComponentInput,
  $FormTextFieldComponentInput,
  FormInput,
} from '@meldingen/api-client'
import filter from 'uber-json-schema-filter'

const filterBySchemaPerType = (obj: any) => {
  switch (obj.type) {
    case 'panel':
      return filter($FormPanelComponentInput, obj)
    case 'radio':
      return filter($FormRadioComponentInput, obj)
    case 'select':
      return filter($FormSelectComponentInput, obj)
    case 'selectboxes':
      return filter($FormCheckboxComponentInput, obj)
    case 'textarea':
      // Add autoExpand to object if it doesn't exist, the builder doesn't do that by default
      if (!obj.hasOwnProperty('autoExpand')) {
        return filter($FormTextAreaComponentInput, { ...obj, autoExpand: false })
      }

      return filter($FormTextAreaComponentInput, obj)
    case 'textfield':
      return filter($FormTextFieldComponentInput, obj)
    default:
      throw Error(`Type ${obj.type} is unknown, please add it to filterFormResponse.`)
  }
}

const getFilteredValidateObject = (validateObj: any) => {
  const validate = filter($FormComponentInputValidate, validateObj)

  // Explicitly remove the 'json' key if its value is an empty string, the API doesn't accept that
  if (validate?.json === '') {
    delete validate.json
  }

  return validate
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterFormResponse = (obj: any): FormInput => {
  const firstLevelComponents = obj.components.map((firstLevelComponent: any) => {
    const secondLevelComponents = firstLevelComponent.components.map((secondLevelComponent: any) => {
      return {
        ...filterBySchemaPerType(secondLevelComponent),
        validate: getFilteredValidateObject(secondLevelComponent.validate),
      }
    })

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
    ...filter($FormInput, obj),
    components: firstLevelComponents,
  }
}
