import type { FormType } from '@formio/react'
import { Edit } from 'react-admin'

import { CreateEditForm } from './CreateEditForm'
import { filterFormResponse } from '../utils/filterFormResponse'

export const FormEdit = () => {
  // The data is filtered here before being passed to the API
  const transform = (data: FormType) => filterFormResponse(data)

  return (
    <Edit transform={transform}>
      <CreateEditForm isEditForm />
    </Edit>
  )
}
