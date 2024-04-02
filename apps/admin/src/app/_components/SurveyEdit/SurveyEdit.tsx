'use client'

import { Edit, SimpleForm, TextInput } from 'react-admin'

export const SurveyEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
)
