import { Datagrid, List, TextField, TextInput } from 'react-admin'

const surveyFilters = [<TextInput label="Search" source="q" alwaysOn />]

export const FormList = () => (
  <List filters={surveyFilters}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="classification_id" sortable={false} />
    </Datagrid>
  </List>
)
