import type { ChangeEvent } from 'react'

import styles from './FileInput.module.css'

type Props = {
  id: string
  hasErrorMessage: boolean
  handleOnChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const FileInput = ({ id, handleOnChange, hasErrorMessage }: Props) => (
  <div className={styles.wrapper}>
    <input
      accept="image/jpeg,image/jpg,image/png,android/force-camera-workaround"
      aria-describedby={`file-upload-description ${hasErrorMessage ? 'error-message' : ''}`}
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
