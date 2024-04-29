import { Edit } from 'react-admin'

import { CreateEditForm } from '../CreateEditForm'

export const FormEdit = () => (
  <Edit
    transform={(data: any) => ({
      ...data,
      components: data.components,
    })}
  >
    <CreateEditForm isEditForm />
  </Edit>
)
