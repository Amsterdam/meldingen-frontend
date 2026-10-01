import { DeleteWithConfirmButton, required, SaveButton, TextInput, Toolbar, ToolbarClasses } from 'react-admin'

import { BuilderInput } from './BuilderInput'
import { ClassificationInput } from './ClassificationInput'
import { MeldingenSimpleForm } from '~/shared/simple-form/MeldingenSimpleForm'

type CreateEditFormProps = {
  isEditForm?: boolean
}

export const CreateEditForm = ({ isEditForm = false }: CreateEditFormProps) => (
  <MeldingenSimpleForm
    toolbar={
      <Toolbar>
        <div className={ToolbarClasses.defaultToolbar}>
          <SaveButton alwaysEnable />
          {isEditForm && <DeleteWithConfirmButton />}
        </div>
      </Toolbar>
    }
  >
    <TextInput source="title" validate={required()} />
    <TextInput defaultValue="wizard" hidden source="display" />
    <ClassificationInput />
    <BuilderInput />
  </MeldingenSimpleForm>
)
