import { Datagrid, List, TextField, TextInput } from 'react-admin'

const surveyFilters = [<TextInput label="ra.action.search" source="q" alwaysOn key="search" />]

export const FormList = () => (
  <List filters={surveyFilters}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="classification" sortable={false} />
    </Datagrid>
  </List>
)
