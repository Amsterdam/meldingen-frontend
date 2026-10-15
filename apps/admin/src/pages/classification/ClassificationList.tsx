import { Datagrid, List, SearchInput, TextField } from 'react-admin'

const classificationFilters = [<SearchInput alwaysOn key="search" source="q" />]

export const ClassificationList = () => (
  <List filters={classificationFilters} resource="classification">
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="id" />
    </Datagrid>
  </List>
)
