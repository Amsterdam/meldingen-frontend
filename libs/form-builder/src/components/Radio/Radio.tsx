import { Components } from '@formio/react'

import { editForm } from './editForm'

const FormioRadio = (Components as any).components.radio

export class Radio extends FormioRadio {
  static editForm = editForm
}
