import styles from './FileUpload.module.css'

export const FileUpload = ({
  buttonText = 'Bestanden kiezen',
  dropAreaText = 'Sleep bestanden in dit vak of',
  onChange,
}: {
  buttonText?: string
  dropAreaText?: string
  onChange: (files: FileList | null) => void
}) => {
  const handleClick = () => {
    // Create a temporary input in order to open the file upload dialog
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.onchange = () => {
      onChange(input.files)
    }
    input.click()
  }

  return (
    <button className={styles.upload} type="button" onClick={handleClick}>
      <span>{dropAreaText}</span> <span className={styles.button}>{buttonText}</span>
    </button>
  )
}
