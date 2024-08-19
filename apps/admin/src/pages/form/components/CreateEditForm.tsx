import {
  SimpleForm,
  Toolbar,
  SaveButton,
  TextInput,
  ToolbarClasses,
  DeleteWithConfirmButton,
  required,
} from 'react-admin'

import { BuilderInput } from './BuilderInput'
import { CategoryInput } from './CategoryInput'

type CreateEditFormProps = {
  isEditForm?: boolean
}

export const CreateEditForm = ({ isEditForm = false }: CreateEditFormProps) => (
  <SimpleForm
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
    <TextInput source="display" defaultValue="wizard" hidden />
    <CategoryInput />
    <BuilderInput />
  </SimpleForm>
)
