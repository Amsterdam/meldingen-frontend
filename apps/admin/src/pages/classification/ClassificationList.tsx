import { Datagrid, List, TextField, TextInput } from 'react-admin'

const classificationFilters = [<TextInput label="ra.action.search" source="q" alwaysOn key="search" />]

export const ClassificationList = () => (
  <List filters={classificationFilters}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="id" />
    </Datagrid>
  </List>
)
