import { Create } from 'react-admin'

import type { FormioSchema } from '../../../types/formio'
import { CreateEditForm } from '../CreateEditForm'

export const FormCreate = () => (
  <Create
    transform={(data: FormioSchema) => ({
      ...data,
      components: data.components,
    })}
  >
    <CreateEditForm />
  </Create>
)
