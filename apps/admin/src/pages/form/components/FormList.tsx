import { Datagrid, List, TextField } from 'react-admin'

export const FormList = () => (
  <List resource="form">
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField sortable={false} source="classification" />
    </Datagrid>
  </List>
)
