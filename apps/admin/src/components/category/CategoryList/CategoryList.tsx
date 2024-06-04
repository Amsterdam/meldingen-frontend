import { Datagrid, List, TextField, TextInput } from 'react-admin'

const categoryFilters = [<TextInput label="ra.action.search" source="q" alwaysOn />]

export const CategoryList = () => (
  <List filters={categoryFilters} hasCreate>
    <Datagrid rowClick="edit">
      <TextField source="name" label="ma.fields.name" />
      <TextField source="id" />
    </Datagrid>
  </List>
)
