import { Create, SaveButton, SimpleForm, Toolbar, ToolbarClasses } from 'react-admin'

import { ClassificationFormFieldsBase } from './ClassificationFormFieldsBase'

export const ClassificationCreate = () => (
  <Create className="crud-form-wrap" redirect="list">
    <SimpleForm
      toolbar={
        <Toolbar>
          <div className={ToolbarClasses.defaultToolbar}>
            <SaveButton alwaysEnable />
          </div>
        </Toolbar>
      }
    >
      <ClassificationFormFieldsBase />
    </SimpleForm>
  </Create>
)
