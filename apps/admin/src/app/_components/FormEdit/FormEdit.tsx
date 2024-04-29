import { Edit } from 'react-admin'

import type { FormioSchema } from '../../../types/formio'
import { CreateEditForm } from '../CreateEditForm'

export const FormEdit = () => (
  <Edit
    transform={(data: FormioSchema) => ({
      ...data,
      components: data.components,
    })}
  >
    <CreateEditForm isEditForm />
  </Edit>
)
