import { Components } from '@formio/react'

import { editForm } from './editForm'

const FormioSelectBoxes = Components.components.selectboxes

export class SelectBoxes extends FormioSelectBoxes {
  static editForm = editForm
}
