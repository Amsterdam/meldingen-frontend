import type { AttachmentOutput } from '@meldingen/api-client'
import type { InputHTMLAttributes } from 'react'

import styles from './FileUpload.module.css'

type Props = {
  id: string
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  uploadedFiles: AttachmentOutput[]
} & InputHTMLAttributes<HTMLInputElement>

export const FileUpload = ({ id, handleOnChange, uploadedFiles, ...restProps }: Props) => (
  <>
    <div className={styles.wrapper}>
      <input {...restProps} multiple type="file" id={id} className={styles.input} onChange={handleOnChange} />
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
