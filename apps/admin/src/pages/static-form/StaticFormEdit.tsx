import type { FormType } from '@formio/react'
import { FormTextAreaComponentInputSchema } from 'libs/api-client/src/schemas.gen'
import { Edit, minLength, required, SaveButton, SimpleForm, TextInput, Toolbar, useEditContext } from 'react-admin'
import filter from 'uber-json-schema-filter'

import { ContactForm } from './ContactForm'
import { PrimaryForm } from './PrimaryForm'

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
      <TextInput source="title" readOnly />
      <TextInput source="components[0].label" validate={validateLabel} />
      <TextInput source="components[0].description" multiline parse={(value) => value ?? ''} />
    </SimpleForm>
  )
}

export const StaticFormEdit = () => {
  // The data is filtered here before being passed to the API
  // It's filtered the same way as in the filterFormResponse function
  const transform = (data: FormType) => {
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
