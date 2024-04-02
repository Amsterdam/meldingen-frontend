import { Components, Templates, Form } from '@formio/react'

import { Button, Textarea } from './components'
import { template } from './template'

export const FormRenderer = ({ form }: any) => {
  Components.setComponents({ button: Button, textarea: Textarea })
  Templates.current = template

  return <Form form={form} />
}
