import { Components } from '@formio/react'

import { SelectBoxesEditForm } from './editForm'

const FormioSelectBoxes = (Components as any).components.selectboxes

export class SelectBoxes extends FormioSelectBoxes {
  get inputInfo() {
    const inputInfo = super.inputInfo

    inputInfo.attr.class = 'ams-checkbox'
    inputInfo.attr.dir = 'auto'

    return inputInfo
  }

  static editForm = SelectBoxesEditForm
}
