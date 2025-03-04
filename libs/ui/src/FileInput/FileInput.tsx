import type { ChangeEvent } from 'react'

import styles from './FileInput.module.css'

export type Props = {
  accept: string
  ariaDescribedBy: string
  handleOnChange: (event: ChangeEvent<HTMLInputElement>) => void
  id: string
  name: string
}

export const FileInput = ({ accept, ariaDescribedBy, handleOnChange, id, name }: Props) => (
  <div className={styles.wrapper}>
    <input
      accept={accept}
      aria-describedby={ariaDescribedBy}
      className={styles.input}
      id={id}
      multiple
      name={name}
      onChange={handleOnChange}
      type="file"
    />
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label htmlFor={id} className={styles.label}>
      <span className={styles.button}>Selecteer bestanden</span>
      <span className={styles.dropAreaText}>Of sleep de bestanden in dit vak.</span>
    </label>
  </div>
)
