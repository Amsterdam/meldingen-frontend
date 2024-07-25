import { Components, Templates, Form } from '@formio/react'
import type { FormProps } from '@formio/react/lib/components/Form'

import { Button, Radio, Textarea, Textfield } from './components'
import { template } from './template'

// options.language isn't defined in FormProps, so we add it here
type FormRendererProps = FormProps & { options?: { language?: string } }

export const FormRenderer = (props: FormRendererProps) => {
  Components.setComponents({ button: Button, radio: Radio, textarea: Textarea, textfield: Textfield })
  Templates.current = template

  return <Form {...props} />
}
