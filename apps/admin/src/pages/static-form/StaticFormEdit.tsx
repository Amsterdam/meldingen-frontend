import { Edit, minLength, required, SaveButton, SimpleForm, TextInput, Toolbar, useEditContext } from 'react-admin'
import filter from 'uber-json-schema-filter'

import type { AdditionalQuestionsForm } from '../types'

import { ContactForm } from './ContactForm'
import { PrimaryForm } from './PrimaryForm'
import { FormTextAreaComponentInputSchema } from 'libs/api-client/src/schemas.gen'

const Form = () => {
  const { record } = useEditContext()

  if (record.type === 'primary') {
    return <PrimaryForm />
  }
  if (record.type === 'contact') {
    return <ContactForm />
  }

  const validateLabel = [required(), minLength(3)]

  return (
    <SimpleForm
      toolbar={
        <Toolbar>
          <SaveButton />
        </Toolbar>
      }
    >
      <TextInput readOnly source="title" />
      <TextInput source="components[0].label" validate={validateLabel} />
      <TextInput multiline parse={(value) => value ?? ''} source="components[0].description" />
    </SimpleForm>
  )
}

export const StaticFormEdit = () => {
  // The data is filtered here before being passed to the API
  // It's filtered the same way as in the filterFormResponse function
  const transform = (data: AdditionalQuestionsForm) => {
    const { components } = data

    const filteredComponents = components.map((component) => filter(FormTextAreaComponentInputSchema, component))

    return {
      ...data,
      components: filteredComponents,
    }
  }

  return (
    <Edit transform={transform}>
      <Form />
    </Edit>
  )
}
