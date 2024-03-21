'use client'

import { Components } from '@formio/react'

import styles from './Textarea.module.css'

const FormioTextArea = (Components as any).components.textarea

export class Textarea extends FormioTextArea {
  get inputInfo() {
    const inputInfo = super.inputInfo
    inputInfo.attr.class += ` ${styles.textarea}`
    return inputInfo
  }
}
