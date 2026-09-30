import { Create, SaveButton, Toolbar, ToolbarClasses } from 'react-admin'

import { ClassificationFormFieldsBase } from './ClassificationFormFieldsBase'
import { MeldingenSimpleForm } from '~/shared/simple-form/MeldingenSimpleForm'

export const ClassificationCreate = () => (
  <Create redirect="list">
    <MeldingenSimpleForm
      toolbar={
        <Toolbar>
          <div className={ToolbarClasses.defaultToolbar}>
            <SaveButton alwaysEnable />
          </div>
        </Toolbar>
      }
    >
      <ClassificationFormFieldsBase />
    </MeldingenSimpleForm>
  </Create>
)
