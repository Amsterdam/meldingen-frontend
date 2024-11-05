import { Datagrid, List, TextField } from 'react-admin'

export const StaticFormList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="title" />
    </Datagrid>
  </List>
)
