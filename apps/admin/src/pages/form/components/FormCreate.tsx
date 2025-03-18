import type { FormType } from '@formio/react'
import { Create } from 'react-admin'

import { CreateEditForm } from './CreateEditForm'
import { filterFormResponse } from '../utils/filterFormResponse'

export const FormCreate = () => {
  // The data is filtered here before being passed to the API
  const transform = (data: FormType) => filterFormResponse(data)

  return (
    <Create transform={transform} redirect="list">
      <CreateEditForm />
    </Create>
  )
}
