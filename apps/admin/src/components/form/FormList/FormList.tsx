import { Datagrid, List, TextField, TextInput } from 'react-admin'

const surveyFilters = [<TextInput label="Search" source="q" alwaysOn />]

export const FormList = () => (
  <List filters={surveyFilters} sort={{ field: 'title', order: 'ASC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="classification" sortable={false} />
    </Datagrid>
  </List>
)
