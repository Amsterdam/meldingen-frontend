import { CreateButton, Datagrid, ExportButton, List, TextField, TextInput, TopToolbar } from 'react-admin'

const surveyFilters = [<TextInput label="Search" source="q" alwaysOn />]

const ListActions = () => (
  <TopToolbar>
    <CreateButton
      resource="form"
      state={{
        data: {
          title: 'testula',
          display: 'form',
          classification: null,
          components: [
            {
              label: 'string',
              description: 'string',
              key: 'string',
              type: 'string',
              input: true,
              autoExpand: true,
              showCharCount: true,
            },
          ],
        },
      }}
    />
    <ExportButton />
  </TopToolbar>
)

export const FormList = () => (
  <List filters={surveyFilters} actions={<ListActions />}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="classification" />
    </Datagrid>
  </List>
)
