import { ArrayInput, BooleanInput, Create, SimpleForm, SimpleFormIterator, TextInput } from 'react-admin'

export const FormCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="display" defaultValue="form" />
      <ArrayInput source="components">
        <SimpleFormIterator inline>
          <TextInput source="label" helperText={false} />
          <TextInput source="description" helperText={false} />
          <TextInput source="key" helperText={false} />
          <TextInput source="type" helperText={false} />
          <BooleanInput source="input" />
          <BooleanInput source="autoExpand" />
          <BooleanInput source="showCharCount" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
)
