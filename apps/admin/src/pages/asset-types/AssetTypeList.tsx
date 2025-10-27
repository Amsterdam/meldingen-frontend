import { Datagrid, List, TextField } from 'react-admin'

export const AssetTypeList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="id" />
    </Datagrid>
  </List>
)
