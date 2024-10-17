import { Button } from '@amsterdam/design-system-react'

// @ts-expect-error: Should expect string
import styles from './file-upload.module.css'

export const FileUpload = () => {
  const handleOnChange = (acceptedFiles: any) => {
    // Do something with the files
    console.log('Accepted files: ', acceptedFiles.target.files)
  }

  return (
    <div className={styles['file-upload-wrapper']}>
      <label htmlFor="file-input">
        <Button variant="secondary" className={styles['file-upload-button']}>
          Selecteer bestanden
        </Button>
        <span className={styles['file-upload-drop-area']}>Of sleep de bestanden in dit vak.</span>

        <input type="file" id="file-input" className={styles['file-upload-input']} onChange={handleOnChange} />
      </label>
    </div>
  )
}
