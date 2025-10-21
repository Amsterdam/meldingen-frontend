import { Datagrid, List, TextField, TextInput } from 'react-admin'

const assetTypeFilters = [<TextInput label="ra.action.search" source="q" alwaysOn key="search" />]

export const AssetTypeList = () => (
  <List filters={assetTypeFilters}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="id" />
    </Datagrid>
  </List>
)
