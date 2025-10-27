import { Datagrid, List, TextField } from 'react-admin'

export const FormList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="classification" sortable={false} />
    </Datagrid>
  </List>
)
