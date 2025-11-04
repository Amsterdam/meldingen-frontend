import { Button } from '@amsterdam/design-system-react/dist/Button'
import { ErrorMessage } from '@amsterdam/design-system-react/dist/ErrorMessage'
import { Icon } from '@amsterdam/design-system-react/dist/Icon'
import { Image } from '@amsterdam/design-system-react/dist/Image'
import { WarningIcon } from '@amsterdam/design-system-react-icons'
import { clsx } from 'clsx'
import { HTMLAttributes, useMemo } from 'react'

import styles from './FileList.module.css'

// Although a description list (<dl>, <dt> and <dd>) would be more semantically correct than an unordered list (<ul> and <li>),
// an unordered list with list items is used here because NVDA currently (16-9-2025) reads the number of items in a description list incorrectly.

export type FileListItemProps = HTMLAttributes<HTMLLIElement> & {
  deleteButtonId: string
  errorMessage?: string
  file: File
  onDelete?: () => void
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
}

export const FileListItem = ({ deleteButtonId, errorMessage, file, onDelete, progress, status }: FileListItemProps) => {
  // Memoize the creation of an object url from the file,
  // to prevent it from creating a new one on every render.
  const imageUrl = useMemo(() => URL.createObjectURL(file), [file])

  const actionButtonLabel = status === 'success' || status === 'error' ? 'Verwijderen' : 'Annuleren'
  const progressPercentage = status === 'success' ? 'geslaagd' : Math.round(progress) + '%'

  const statusMessage =
    status === 'error' ? (
      <ErrorMessage icon={false} className={styles.error}>
        {errorMessage}
      </ErrorMessage>
    ) : (
      <span>{`Upload ${progressPercentage}`}</span>
    )

  const image =
    status === 'error' ? (
      <Icon svg={WarningIcon} size="heading-1" className={styles.icon} />
    ) : (
      <Image src={imageUrl} alt="" />
    )

  const handleDelete = () => {
    URL.revokeObjectURL(imageUrl)
    onDelete?.()
  }

  return (
    <li className={styles.item}>
      <div className={clsx(styles.container, Boolean(errorMessage) && styles.containerWithError)}>
        {image}
        <div className={styles.description}>
          <span>{file.name}</span>
          {statusMessage}
        </div>
        <Button className={styles.deleteButton} id={deleteButtonId} variant="secondary" onClick={handleDelete}>
          {actionButtonLabel} <span className="ams-visually-hidden">{file.name}</span>
        </Button>
      </div>
    </li>
  )
}
