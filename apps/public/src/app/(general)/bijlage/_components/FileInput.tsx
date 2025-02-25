import type { ChangeEvent } from 'react'

import styles from './FileInput.module.css'

type Props = {
  id: string
  handleOnChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const FileInput = ({ id, handleOnChange }: Props) => (
  <div className={styles.wrapper}>
    <input
      accept={`${['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].join(',')},android/force-camera-workaround`}
      aria-describedby="file-input-description error-message"
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
