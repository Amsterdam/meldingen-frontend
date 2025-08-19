import { Components } from '@formio/js'

import { editForm } from './editForm'

const FormioTextfield = Components.components.textfield

export class Textfield extends FormioTextfield {
  static editForm = editForm
}
