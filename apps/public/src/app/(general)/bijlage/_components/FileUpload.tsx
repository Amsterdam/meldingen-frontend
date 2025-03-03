import type { AttachmentOutput } from 'apps/public/src/apiClientProxy'
import type { InputHTMLAttributes, ChangeEvent } from 'react'

import styles from './FileUpload.module.css'

type Props = {
  id: string
  handleOnChange: (event: ChangeEvent<HTMLInputElement>) => void
  uploadedFiles: AttachmentOutput[]
} & InputHTMLAttributes<HTMLInputElement>

export const FileUpload = ({ id, handleOnChange, uploadedFiles, ...restProps }: Props) => (
  <>
    <div className={styles.wrapper}>
      <input
        {...restProps}
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
    {uploadedFiles.length > 0 && (
      <div className="ams-mb--sm">
        {uploadedFiles.map((file) => (
          <div key={file.id}>
            <span>{file.original_filename}</span>
          </div>
        ))}
      </div>
    )}
  </>
)
