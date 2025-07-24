import { Components } from '@formio/js'

import { editForm } from './editForm'

const FormioTextarea = Components.components.textarea

export class Textarea extends FormioTextarea {
  static editForm = editForm
}
