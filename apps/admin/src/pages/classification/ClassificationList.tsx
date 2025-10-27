import { Datagrid, List, TextField } from 'react-admin'

export const ClassificationList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="id" />
    </Datagrid>
  </List>
)
