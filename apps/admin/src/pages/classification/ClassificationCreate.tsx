import { Create, ReferenceInput, required, SaveButton, SimpleForm, TextInput, Toolbar, ToolbarClasses } from 'react-admin'

export const ClassificationCreate = () => (
  <Create redirect="list">
    <SimpleForm
      toolbar={
        <Toolbar>
          <div className={ToolbarClasses.defaultToolbar}>
            <SaveButton alwaysEnable />
          </div>
        </Toolbar>
      }
    >
      <TextInput source="name" validate={required()} />
      <ReferenceInput reference="asset-type" sort={{ field: 'name', order: 'ASC' }} source="asset_type" />
    </SimpleForm>
  </Create>
)
