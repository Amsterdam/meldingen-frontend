import {
  DeleteWithConfirmButton,
  Edit,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  ToolbarClasses,
} from 'react-admin'

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
      <TextInput source="name" validate={required()} />
      <TextInput source="form" readOnly />
    </SimpleForm>
  </Edit>
)
