import { Edit, SimpleForm, TextInput } from 'react-admin'

import { Builder } from '../Builder'

export const FormEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" />
      <Builder />
    </SimpleForm>
  </Edit>
)
