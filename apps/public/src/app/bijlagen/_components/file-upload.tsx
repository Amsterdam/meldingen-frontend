import styles from './file-upload.module.css'

export const FileUpload = () => {
  const handleOnChange = (acceptedFiles: any) => {
    // Do something with the files
    console.log('Accepted files: ', acceptedFiles.target.files)
  }

  return (
    <div className={styles['file-upload-wrapper']}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="file-input" className={styles['file-upload-label']}>
        <span id="label" className={styles['file-upload-button']}>
          Selecteer bestanden
        </span>
        <span className={styles['file-upload-drop-area-text']}>Of sleep de bestanden in dit vak.</span>
      </label>
      <input type="file" id="file-input" className={styles['file-upload-input']} onChange={handleOnChange} />
    </div>
  )
}
