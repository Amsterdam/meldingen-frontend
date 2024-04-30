import { DeleteButton, Edit, SaveButton, SimpleForm, TextInput, Toolbar, ToolbarClasses } from 'react-admin'

export const CategoryEdit = () => (
  <Edit>
    <SimpleForm
      toolbar={
        <Toolbar>
          <div className={ToolbarClasses.defaultToolbar}>
            <SaveButton alwaysEnable />
            <DeleteButton />
          </div>
        </Toolbar>
      }
    >
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
)
