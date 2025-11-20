import { Create } from 'react-admin'

import type { AdditionalQuestionsForm } from '../../types'

import { filterFormResponse } from '../utils/filterFormResponse'
import { CreateEditForm } from './CreateEditForm'

export const FormCreate = () => {
  // The data is filtered here before being passed to the API
  const transform = (data: AdditionalQuestionsForm) => filterFormResponse(data)

  return (
    <Create redirect="list" transform={transform}>
      <CreateEditForm />
    </Create>
  )
}
