import { Edit } from 'react-admin'

import type { AdditionalQuestionsForm } from '../../types'

import { filterFormResponse } from '../utils/filterFormResponse'
import { CreateEditForm } from './CreateEditForm'

export const FormEdit = () => {
  // The data is filtered here before being passed to the API
  const transform = (data: AdditionalQuestionsForm) => filterFormResponse(data)

  return (
    <Edit transform={transform}>
      <CreateEditForm isEditForm />
    </Edit>
  )
}
