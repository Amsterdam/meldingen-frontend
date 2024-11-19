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
import { BuilderInput } from '../form/components/BuilderInput'
import type { FormioSchema } from '@meldingen/formio'
import { filterFormResponse } from '../form/utils/filterFormResponse'

// The data is filtered here before being passed to the API
const transform = (data: FormioSchema) => filterFormResponse(data)

export const StaticFormEdit = () => (
  <Edit transform={transform}>
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
      <TextInput source="title" readOnly />
      <BuilderInput />
    </SimpleForm>
  </Edit>
)
