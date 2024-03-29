'use client'

import { Edit, SimpleForm, TextInput } from 'react-admin'

export function SurveyEdit() {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="name" />
      </SimpleForm>
    </Edit>
  )
}
