import { DeleteWithConfirmButton, Edit, SaveButton, TextInput, Toolbar, ToolbarClasses } from 'react-admin'

import { ClassificationFormFieldsBase } from './ClassificationFormFieldsBase'
import { MeldingenSimpleForm } from '~/shared/simple-form/MeldingenSimpleForm'

export const ClassificationEdit = () => (
  <Edit>
    <MeldingenSimpleForm
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
    </MeldingenSimpleForm>
  </Edit>
)
