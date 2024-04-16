import { Edit, SimpleForm, TextInput } from 'react-admin'

export const FormEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
)
