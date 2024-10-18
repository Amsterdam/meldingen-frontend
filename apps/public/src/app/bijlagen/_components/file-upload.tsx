import { Button } from '@amsterdam/design-system-react'
import { useRef } from 'react'

import styles from './file-upload.module.css'

export const FileUpload = () => {
  const handleOnChange = (acceptedFiles: any) => {
    // Do something with the files
    console.log('Accepted files: ', acceptedFiles.target.files)
  }

  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={styles['file-upload-wrapper']}>
      <label htmlFor="file-input">
        <Button className={styles['file-upload-button']} variant="secondary" onClick={() => inputRef.current?.click()}>
          Selecteer bestanden
        </Button>
        <span className={styles['file-upload-drop-area-text']}>Of sleep de bestanden in dit vak.</span>

        <input
          ref={inputRef}
          type="file"
          id="file-input"
          className={styles['file-upload-input']}
          onChange={handleOnChange}
          tabIndex={-1}
        />
      </label>
    </div>
  )
}
