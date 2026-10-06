import { DeleteWithConfirmButton, Edit, SaveButton, SimpleForm, TextInput, Toolbar, ToolbarClasses } from 'react-admin'

import { ClassificationFormFieldsBase } from './ClassificationFormFieldsBase'

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
      <ClassificationFormFieldsBase />
      <TextInput readOnly source="form" />
    </SimpleForm>
  </Edit>
)
