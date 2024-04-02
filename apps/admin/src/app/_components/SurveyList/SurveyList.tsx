import { Datagrid, List, TextField, TextInput } from 'react-admin'

const surveyFilters = [<TextInput label="Search" source="q" alwaysOn />]

export const SurveyList = () => (
  <List filters={surveyFilters}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="id" />
    </Datagrid>
  </List>
)
