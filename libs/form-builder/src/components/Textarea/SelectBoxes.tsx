import { Components } from '@formio/react'

import { editForm } from '../SelectBoxes/editForm'

const FormioSelectBoxes = (Components as any).components.selectboxes

export class SelectBoxes extends FormioSelectBoxes {
  static editForm = editForm
}
