import { DragEvent } from 'react'

import styles from './FileUpload.module.css'

// Based on https://design-system.service.gov.uk/components/file-upload/#using-the-improved-file-upload-component

const getFiles = (dataTransfer: DataTransfer): FileList => {
  // Some browsers support dataTransfer.files and some support dataTransfer.items
  // For that reason, we handle both here.
  // See also https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop#process_the_drop

  // If dataTransfer.files is present and has files, return it directly
  if (dataTransfer.files && dataTransfer.files.length > 0) {
    return dataTransfer.files
  }

  // Otherwise, collect files from items and construct a FileList
  const files: File[] = []
  if (dataTransfer.items) {
    for (let i = 0; i < dataTransfer.items.length; i++) {
      const item = dataTransfer.items[i]
      if (item.kind === 'file') {
        const file = item.getAsFile()
        if (file) files.push(file)
      }
    }
  }

  // Create a FileList from the array of files using a DataTransfer
  const dt = new DataTransfer()
  files.forEach((file) => dt.items.add(file))
  return dt.files
}

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
    input.accept = 'image/jpeg,image/jpg,image/png,android/force-camera-workaround'
    input.multiple = true
    input.onchange = () => {
      onChange(input.files)
    }
    input.click()
  }

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const files = getFiles(event.dataTransfer)
    onChange(files)
  }

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <button
      className={styles.upload}
      type="button"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <span>{dropAreaText}</span> <span className={styles.button}>{buttonText}</span>
    </button>
  )
}
