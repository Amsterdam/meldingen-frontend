import type { InputHTMLAttributes } from 'react'

import styles from './FileInput.module.css'

export type Props = {
  id: string
} & InputHTMLAttributes<HTMLInputElement>

export const FileInput = ({ id, ...restProps }: Props) => (
  <div className={styles.wrapper}>
    <input id={id} type="file" {...restProps} />
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label htmlFor={id} className={styles.label}>
      <span className={styles.button}>Selecteer bestanden</span>
      <span className={styles.dropAreaText}>Of sleep de bestanden in dit vak.</span>
    </label>
  </div>
)
