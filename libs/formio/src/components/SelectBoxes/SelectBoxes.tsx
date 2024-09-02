import { Components } from '@formio/react'

import { SelectBoxesEditForm } from './editForm'

const FormioSelectBoxes = (Components as any).components.selectboxes

export class SelectBoxes extends FormioSelectBoxes {
  static editForm = SelectBoxesEditForm
}
