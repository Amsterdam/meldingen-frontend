import { Create } from 'react-admin'

import { CreateEditForm } from './CreateEditForm'
import type { AdditionalQuestionsForm } from '../../types'
import { filterFormResponse } from '../utils/filterFormResponse'

export const FormCreate = () => {
  // The data is filtered here before being passed to the API
  const transform = (data: AdditionalQuestionsForm) => filterFormResponse(data)

  return (
    <Create transform={transform} redirect="list">
      <CreateEditForm />
    </Create>
  )
}
