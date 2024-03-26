'use client'

import { Datagrid, List, TextField } from 'react-admin'

export function SurveyList() {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="name" />
        <TextField source="id" />
      </Datagrid>
    </List>
  )
}
