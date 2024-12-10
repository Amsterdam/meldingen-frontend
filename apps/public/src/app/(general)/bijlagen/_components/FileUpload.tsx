import type { AttachmentOutput } from '@meldingen/api-client'
import { postMeldingByMeldingIdAttachment } from '@meldingen/api-client'
import { useState } from 'react'
import type { ChangeEvent } from 'react'

import { useMeldingContext } from '../../../../context/MeldingContextProvider'

import styles from './FileUpload.module.css'

export const FileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<AttachmentOutput[]>([])

  const { data } = useMeldingContext()

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (data && event.currentTarget.files) {
      const filesArray = Array.from(event.currentTarget.files)

      filesArray.forEach(async (file: File) => {
        try {
          const result = await postMeldingByMeldingIdAttachment({
            formData: { file },
            meldingId: data.id,
            token: data.token,
          })
          setUploadedFiles((currentFiles) => [...currentFiles, result])
        } catch (error) {
          console.error('Error uploading file: ', error)
        }
      })
    }
  }

  return (
    <>
      <div className={styles.wrapper}>
        <input multiple type="file" id="file-input" className={styles.input} onChange={handleOnChange} />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="file-input" className={styles.label}>
          <span className={styles.button}>Selecteer bestanden</span>
          <span className={styles['drop-area-text']}>Of sleep de bestanden in dit vak.</span>
        </label>
      </div>
      <div>
        Dummy List
        {uploadedFiles.map((file) => (
          <div key={file.id}>
            <span>{file.original_filename}</span>
          </div>
        ))}
      </div>
    </>
  )
}
