import type { FormioSchema } from '@meldingen/form-builder'
import { Create } from 'react-admin'

import { filterFormResponse } from '../utils/filterFormResponse'

import { CreateEditForm } from './CreateEditForm'

export const FormCreate = () => {
  // The data is filtered here before being passed to the API
  const transform = (data: FormioSchema) => filterFormResponse(data)

  return (
    <Create transform={transform} redirect="list">
      <CreateEditForm />
    </Create>
  )
}
