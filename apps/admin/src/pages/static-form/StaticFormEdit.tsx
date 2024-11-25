import { FormioSchema } from '@meldingen/formio'
import { Edit, SimpleForm, TextInput } from 'react-admin'
import filter from 'uber-json-schema-filter'
import { FormTextAreaComponentInputSchema } from '@meldingen/api-client'

export const StaticFormEdit = () => {
  // todo: geen disable button
  // labels van velden mooier maken

  // The data is filtered here before being passed to the API
  // It's filtered the same way as in the filterFormResponse function
  const transform = (data: FormioSchema) => {
    const component = data.components[0]
    const filteredComponent = filter(FormTextAreaComponentInputSchema, component)

    return {
      ...data,
      components: [filteredComponent],
    }
  }

  return (
    <Edit transform={transform}>
      <SimpleForm>
        <TextInput source="title" readOnly />
        <TextInput source="components[0].label" />
        <TextInput source="components[0].description" />
      </SimpleForm>
    </Edit>
  )
}
