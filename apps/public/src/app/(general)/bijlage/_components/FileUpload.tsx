import type { InputHTMLAttributes, ChangeEvent, Dispatch, SetStateAction } from 'react'

import type { UploadedFiles } from '../Bijlage'

import { FileList } from './FileList'
import styles from './FileUpload.module.css'

type Props = {
  id: string
  handleOnChange: (event: ChangeEvent<HTMLInputElement>) => void
  uploadedFiles: UploadedFiles[]
  meldingId: number
  token: string
  setUploadedFiles: Dispatch<SetStateAction<UploadedFiles[]>>
} & InputHTMLAttributes<HTMLInputElement>

export const FileUpload = ({
  id,
  handleOnChange,
  uploadedFiles,
  meldingId,
  token,
  setUploadedFiles,
  ...restProps
}: Props) => (
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
    <FileList uploadedFiles={uploadedFiles} meldingId={meldingId} token={token} setUploadedFiles={setUploadedFiles} />
  </>
)
