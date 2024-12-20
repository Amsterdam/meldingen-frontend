import { Components } from '@formio/react'

import { editForm } from './editForm'

const FormioSelect = (Components as any).components.select

export class Select extends FormioSelect {
  static editForm = editForm
}
