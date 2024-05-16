import { DeleteWithConfirmButton, Edit, SaveButton, SimpleForm, TextInput, Toolbar, ToolbarClasses } from 'react-admin'

export const CategoryEdit = () => (
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
      <TextInput source="form_id" readOnly />
    </SimpleForm>
  </Edit>
)
