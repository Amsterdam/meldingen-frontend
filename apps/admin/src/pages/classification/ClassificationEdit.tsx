import { DeleteWithConfirmButton, Edit, SaveButton, SimpleForm, TextInput, Toolbar, ToolbarClasses } from 'react-admin'

export const ClassificationEdit = () => (
  <Edit>
    <SimpleForm
      toolbar={
        <Toolbar>
          <div className={ToolbarClasses.defaultToolbar}>
            <SaveButton alwaysEnable />
            <DeleteWithConfirmButton />
          </div>
        </Toolbar>
      }
    >
      <TextInput source="name" />
      <TextInput source="asset_type" />
      <TextInput source="form" readOnly />
    </SimpleForm>
  </Edit>
)
