import { DeleteWithConfirmButton, Edit, SaveButton, SimpleForm, TextInput, Toolbar, ToolbarClasses } from 'react-admin'
import { BuilderInput } from '../form/components/BuilderInput'

export const StaticFormEdit = () => (
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
      <TextInput source="name" readOnly />
      <BuilderInput />
    </SimpleForm>
  </Edit>
)
