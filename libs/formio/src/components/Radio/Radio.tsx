import { Components } from '@formio/react'

const FormioRadio = (Components as any).components.radio

export class Radio extends FormioRadio {
  get inputInfo() {
    const inputInfo = super.inputInfo

    inputInfo.attr.class = 'ams-radio__input'

    return inputInfo
  }
}
