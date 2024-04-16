import { Edit, SimpleForm, TextInput } from 'react-admin'

import { Builder } from '../Builder'

export const FormEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <Builder />
    </SimpleForm>
  </Edit>
)
