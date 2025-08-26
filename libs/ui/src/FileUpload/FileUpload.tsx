import styles from './FileUpload.module.css'

export const FileUpload = () => {
  return (
    <button className={styles.upload} type="button">
      <span>Sleep bestanden in dit vak of</span> <span className={styles.button}>Bestanden kiezen</span>
    </button>
  )
}
