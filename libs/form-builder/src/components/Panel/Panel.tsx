import { Components } from '@formio/js'

import { editForm } from './editForm'

const FormioPanel = Components.components.panel

export class Panel extends FormioPanel {
  static editForm = editForm
}
