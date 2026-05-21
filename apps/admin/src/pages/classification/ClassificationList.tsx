import { Datagrid, List, TextField } from 'react-admin'

export const ClassificationList = () => (
  <List resource="classification">
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="id" />
    </Datagrid>
  </List>
)
