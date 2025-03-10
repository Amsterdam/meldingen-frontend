import type { InputHTMLAttributes } from 'react'

import styles from './FileInput.module.css'

export type Props = {
  buttonText: string
  dropAreaText: string
  id: string
} & InputHTMLAttributes<HTMLInputElement>

export const FileInput = ({ buttonText, dropAreaText, id, ...restProps }: Props) => (
  <div className={styles.wrapper}>
    <input id={id} type="file" {...restProps} />
    <label htmlFor={id} className={styles.label}>
      <span className={styles.button}>{buttonText}</span>
      <span className={styles.dropAreaText}>{dropAreaText}</span>
    </label>
  </div>
)
