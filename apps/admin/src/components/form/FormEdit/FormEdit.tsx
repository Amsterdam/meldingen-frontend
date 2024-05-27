import type { ComponentSchema } from 'formiojs'
import { Edit } from 'react-admin'

import type { FormioSchema } from '../../../types/formio'
import { CreateEditForm } from '../CreateEditForm'

// Keys 'question' and 'position' are provided by the API, but you can't pass them back.
// For that reason, they are filtered here.
const replacer = (key: string, val: any) => (key === 'question' || key === 'position' ? undefined : val)
const filterKeys = (obj: ComponentSchema[]) => JSON.parse(JSON.stringify(obj, replacer))

export const FormEdit = () => {
  const transform = (data: FormioSchema) => ({
    ...data,
    components: filterKeys(data.components),
  })

  return (
    <Edit transform={transform}>
      <CreateEditForm isEditForm />
    </Edit>
  )
}
