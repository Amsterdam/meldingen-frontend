import { Button } from '@amsterdam/design-system-react/dist/Button'
import { Icon } from '@amsterdam/design-system-react/dist/Icon'
import { Image } from '@amsterdam/design-system-react/dist/Image'
import { WarningIcon } from '@amsterdam/design-system-react-icons'
import { clsx } from 'clsx'
import { HTMLAttributes, useMemo } from 'react'

import styles from './FileList.module.css'

// Although a description list (<dl>, <dt> and <dd>) would be more semantically correct than an unordered list (<ul> and <li>),
// an unordered list with list items is used here because NVDA currently (16-9-2025) reads the number of items in a description list incorrectly.

export type FileListItemProps = HTMLAttributes<HTMLLIElement> & {
  actionButtonLabelDelete: string
  actionButtonLabelCancel: string
  progressLabelFinished: string
  progressLabelLoading: string
  deleteButtonId: string
  errorMessage?: string
  file: File
  onDelete?: () => void
  status: 'pending' | 'uploading' | 'success' | 'error'
}

export const FileListItem = ({
  deleteButtonId,
  errorMessage,
  file,
  onDelete,
  status,
  actionButtonLabelDelete,
  actionButtonLabelCancel,
  progressLabelFinished,
  progressLabelLoading,
}: FileListItemProps) => {
  // Memoize the creation of an object url from the file,
  // to prevent it from creating a new one on every render.
  const imageUrl = useMemo(() => URL.createObjectURL(file), [file])

  const isError = status === 'error'
  const isFinished = status === 'success'

  const actionButtonLabel = isFinished || isError ? actionButtonLabelDelete : actionButtonLabelCancel
  const progressLabel = isFinished ? progressLabelFinished : progressLabelLoading

  const handleDelete = () => {
    URL.revokeObjectURL(imageUrl)
    onDelete?.()
  }

  return (
    <li className={styles.item}>
      <div className={clsx(styles.container, errorMessage && styles.containerWithError)}>
        <div className={clsx(styles.imageContainer, errorMessage && styles.imageContainerWithError)}>
          {isError ? (
            <Icon svg={WarningIcon} size="heading-1" className={styles.icon} />
          ) : (
            <Image src={imageUrl} alt="" />
          )}
        </div>
        <div className={styles.description}>
          <span>{file.name}</span>
          {isError ? (
            <span className={styles.errorMessage}>{errorMessage}</span>
          ) : (
            <span className={styles.statusMessage}>{progressLabel}</span>
          )}
        </div>
        <Button className={styles.deleteButton} id={deleteButtonId} variant="secondary" onClick={handleDelete}>
          {actionButtonLabel} <span className="ams-visually-hidden">{file.name}</span>
        </Button>
      </div>
    </li>
  )
}
