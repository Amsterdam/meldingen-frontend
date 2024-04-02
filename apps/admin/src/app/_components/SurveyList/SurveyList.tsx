import { Datagrid, List, TextField } from 'react-admin'

export const SurveyList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="id" />
    </Datagrid>
  </List>
)
