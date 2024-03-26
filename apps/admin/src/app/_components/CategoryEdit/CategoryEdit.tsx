'use client'

import { Edit, SimpleForm, TextInput } from 'react-admin'

export function CategoryEdit() {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="name" />
      </SimpleForm>
    </Edit>
  )
}
