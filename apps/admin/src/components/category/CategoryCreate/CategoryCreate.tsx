import { Create, SaveButton, SimpleForm, TextInput, Toolbar, ToolbarClasses } from 'react-admin'

export const CategoryCreate = () => (
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
      <TextInput source="name" />
      <TextInput source="form_id" />
    </SimpleForm>
  </Create>
)
