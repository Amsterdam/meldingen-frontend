import { Components, Templates, Form } from '@formio/react'

import { Button, Textarea } from './components'
import { template } from './template'

export const FormRenderer = ({ form, onSubmit }: any) => {
  Components.setComponents({ button: Button, textarea: Textarea })
  Templates.current = template

  return <Form form={form} onSubmit={onSubmit} />
}
