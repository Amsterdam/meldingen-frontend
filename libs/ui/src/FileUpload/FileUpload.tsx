'use client'

import { clsx } from 'clsx'
import { ChangeEvent, DragEvent, InputHTMLAttributes, useRef } from 'react'

import styles from './FileUpload.module.css'

// Based on https://design-system.service.gov.uk/components/file-upload/#using-the-improved-file-upload-component
// and https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/components/file-upload/file-upload.mjs

// Checks if the given `DataTransfer` contains files
const isContainingFiles = (dataTransfer: DataTransfer): boolean => {
  // Safari sometimes does not provide info about types :'(
  // In which case best not to assume anything and try to set the files
  const hasNoTypesInfo = dataTransfer.types.length === 0

  // When dragging images, there's a mix of mime types + Files
  // which we can't assign to the native input
  const isDraggingFiles = dataTransfer.types.some((type) => type === 'Files')

  return hasNoTypesInfo || isDraggingFiles
}

type Props = InputHTMLAttributes<HTMLInputElement> & {
  buttonText?: string
  className?: string
  dropAreaText?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const FileUpload = ({
  buttonText = 'Bestanden kiezen',
  className,
  dropAreaText = 'Sleep bestanden in dit vak of',
  ...restProps
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (fileInputRef.current && event.dataTransfer && isContainingFiles(event.dataTransfer)) {
      fileInputRef.current.files = event.dataTransfer.files

      // Trigger change event of file input
      const changeEvent = new Event('change', { bubbles: true })
      fileInputRef.current.dispatchEvent(changeEvent)
    }
  }

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  return (
    <>
      <button
        className={clsx(styles.upload, className)}
        type="button"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <span className={styles.dropAreaText}>{dropAreaText}</span> <span className={styles.button}>{buttonText}</span>
      </button>
      <input {...restProps} aria-hidden="true" hidden ref={fileInputRef} tabIndex={-1} type="file" />
    </>
  )
}
