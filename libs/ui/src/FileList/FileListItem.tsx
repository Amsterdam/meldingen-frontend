import { Button } from '@amsterdam/design-system-react/dist/Button'
import { Icon } from '@amsterdam/design-system-react/dist/Icon'
import { WarningIcon } from '@amsterdam/design-system-react-icons'
import { clsx } from 'clsx'
import { HTMLAttributes } from 'react'

import { AttachmentImage } from './FileListImage'

import styles from './FileList.module.css'

// Although a description list (<dl>, <dt> and <dd>) would be more semantically correct than an unordered list (<ul> and <li>),
// an unordered list with list items is used here because NVDA currently (16-9-2025) reads the number of items in a description list incorrectly.

export type FileListItemProps = HTMLAttributes<HTMLLIElement> & {
  deleteButtonId: string
  errorMessage?: string
  file: File
  labels: {
    actionButtonCancelLabel: string
    actionButtonDeleteLabel: string
    progressFinishedLabel: string
    progressLoadingLabel: string
  }
  onDelete?: () => void
  status: 'pending' | 'uploading' | 'success' | 'error'
}

export const FileListItem = ({ deleteButtonId, errorMessage, file, labels, onDelete, status }: FileListItemProps) => {
  const { actionButtonCancelLabel, actionButtonDeleteLabel, progressFinishedLabel, progressLoadingLabel } = labels

  const isError = status === 'error'
  const isFinished = status === 'success'

  const actionButtonLabel = isFinished || isError ? actionButtonDeleteLabel : actionButtonCancelLabel
  const progressLabel = isFinished ? progressFinishedLabel : progressLoadingLabel

  return (
    <li className={styles.item}>
      <div className={clsx(styles.container, errorMessage && styles.containerWithError)}>
        <div className={styles.imageContainer}>
          {isError ? (
            <Icon svg={WarningIcon} size="heading-1" className={styles.icon} />
          ) : (
            <AttachmentImage blob={file} />
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
        <Button className={styles.deleteButton} id={deleteButtonId} variant="secondary" onClick={() => onDelete?.()}>
          {actionButtonLabel} <span className="ams-visually-hidden">{file.name}</span>
        </Button>
      </div>
    </li>
  )
}
