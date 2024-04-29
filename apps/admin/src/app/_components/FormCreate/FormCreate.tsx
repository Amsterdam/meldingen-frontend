import { Create } from 'react-admin'

import { CreateEditForm } from '../CreateEditForm'

export const FormCreate = () => (
  <Create
    transform={(data: any) => ({
      ...data,
      components: data.components,
    })}
  >
    <CreateEditForm />
  </Create>
)
