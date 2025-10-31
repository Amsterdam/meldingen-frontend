import { Button } from '@amsterdam/design-system-react/dist/Button'
import { ErrorMessage } from '@amsterdam/design-system-react/dist/ErrorMessage'
import { Image } from '@amsterdam/design-system-react/dist/Image'
import { clsx } from 'clsx'
import { HTMLAttributes, useMemo } from 'react'

import styles from './FileList.module.css'

// Although a description list (<dl>, <dt> and <dd>) would be more semantically correct than an unordered list (<ul> and <li>),
// an unordered list with list items is used here because NVDA currently (16-9-2025) reads the number of items in a description list incorrectly.

export type FileListItemProps = HTMLAttributes<HTMLLIElement> & {
  deleteButtonId: string
  deleteButtonLabel?: string
  errorMessage?: string
  file: File
  onDelete?: () => void
}

export const FileListItem = ({
  deleteButtonId,
  deleteButtonLabel = 'Verwijder',
  errorMessage,
  file,
  onDelete,
}: FileListItemProps) => {
  // Memoize the creation of an object url from the file,
  // to prevent it from creating a new one on every render.
  const imageUrl = useMemo(() => URL.createObjectURL(file), [file])

  const handleDelete = () => {
    URL.revokeObjectURL(imageUrl)
    onDelete?.()
  }

  const hasError = Boolean(errorMessage)

  return (
    <li className={styles.item}>
      <div className={clsx(styles.container, hasError && styles.containerWithError)}>
        <Image src={imageUrl} alt="" />
        <div>{file.name}</div>
        <Button className={styles.deleteButton} id={deleteButtonId} variant="secondary" onClick={handleDelete}>
          {deleteButtonLabel} <span className="ams-visually-hidden">{file.name}</span>
        </Button>
        {hasError && <ErrorMessage className={styles.error}>{errorMessage}</ErrorMessage>}
      </div>
    </li>
  )
}
