import { FormBuilder as FormioFormBuilder } from '@formio/react'

import '@formio/js/dist/formio.builder.min.css'

export function FormBuilder(props: any) {
  return <FormioFormBuilder {...props} />
}
