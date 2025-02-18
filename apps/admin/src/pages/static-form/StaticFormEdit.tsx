import type { FormType } from '@formio/react'
import { FormTextAreaComponentInputSchema } from 'libs/api-client/src/schemas.gen'
import { Edit, SaveButton, SimpleForm, TextInput, Toolbar, useEditContext } from 'react-admin'
import filter from 'uber-json-schema-filter'

const Form = () => {
  const { record } = useEditContext()

  return (
    <SimpleForm
      toolbar={
        <Toolbar>
          <SaveButton />
        </Toolbar>
      }
    >
      <TextInput source="title" readOnly />

      {record.type === 'contact' && (
        <span>
          <strong>E-mail</strong>
        </span>
      )}
      <TextInput source="components[0].label" />
      <TextInput multiline source="components[0].description" />

      {record.type === 'contact' && (
        <>
          <span>
            <strong>Telefoonnummer</strong>
          </span>
          <TextInput source="components[1].label" />
          <TextInput multiline source="components[1].description" />
        </>
      )}
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
