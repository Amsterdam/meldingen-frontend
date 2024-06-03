import { Datagrid, List, TextField, TextInput } from 'react-admin'

const categoryFilters = [<TextInput label="Zoeken" source="q" alwaysOn />]

export const CategoryList = () => (
  <List filters={categoryFilters} hasCreate>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="id" />
    </Datagrid>
  </List>
)
