import { Components, Templates, Form } from '@formio/react'

import { Button, Textarea } from './components'
import { template } from './template'

export const FormRenderer = ({ form }: any) => {
  Components.addComponent('textarea', Textarea)
  Components.addComponent('button', Button)

  Templates.current = template

  return <Form form={form} />
}
