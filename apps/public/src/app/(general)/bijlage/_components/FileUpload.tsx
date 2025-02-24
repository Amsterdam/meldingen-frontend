import type { ChangeEvent } from 'react'

import styles from './FileUpload.module.css'

type Props = {
  id: string
  handleOnChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const FileUpload = ({ id, handleOnChange }: Props) => (
  <div className={styles.wrapper}>
    <input
      aria-describedby="file-upload-description error-message"
      className={styles.input}
      id={id}
      multiple
      name="file"
      onChange={handleOnChange}
      type="file"
    />
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label htmlFor={id} className={styles.label}>
      <span className={styles.button}>Selecteer bestanden</span>
      <span className={styles['drop-area-text']}>Of sleep de bestanden in dit vak.</span>
    </label>
  </div>
)
