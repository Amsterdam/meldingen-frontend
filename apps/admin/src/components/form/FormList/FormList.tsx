import { Datagrid, List, TextField, TextInput } from 'react-admin'

const surveyFilters = [<TextInput label="ra.action.search" source="q" alwaysOn />]

export const FormList = () => (
  <List filters={surveyFilters}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" label="ma.fields.title" />
      <TextField source="classification" label="ma.fields.classification" sortable={false} />
    </Datagrid>
  </List>
)
