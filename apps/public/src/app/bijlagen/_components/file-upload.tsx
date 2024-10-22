import styles from './file-upload.module.css'

export const FileUpload = () => {
  const handleOnChange = (acceptedFiles: any) => {
    // Do something with the files
    console.log('Accepted files: ', acceptedFiles.target.files)
  }

  return (
    <div className={styles.wrapper}>
      <input type="file" id="file-input" className={styles.input} onChange={handleOnChange} />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="file-input" className={styles.label}>
        <span id="label" className={styles.button}>
          Selecteer bestanden
        </span>
        <span className={styles['drop-area-text']}>Of sleep de bestanden in dit vak.</span>
      </label>
    </div>
  )
}
