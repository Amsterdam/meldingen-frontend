import styles from './file-upload.module.css'

export const FileUpload = () => {
  const handleOnChange = (acceptedFiles: any) => {
    // Do something with the files
    console.log('Accepted files: ', acceptedFiles.target.files)
  }

  return (
    <div className={styles['file-upload-wrapper']}>
      <label htmlFor="file-input">
        <span id="label" className={styles['file-upload-button']}>
          Selecteer bestanden
        </span>
        <span className={styles['file-upload-drop-area-text']}>Of sleep de bestanden in dit vak.</span>
        <input type="file" id="file-input" className={styles['file-upload-input']} onChange={handleOnChange} />
      </label>
    </div>
  )
}
