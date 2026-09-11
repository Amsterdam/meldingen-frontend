import type { HTMLAttributes } from 'react'

import { WarningIcon } from '@amsterdam/design-system-react-icons'
import { Button } from '@amsterdam/design-system-react/dist/Button'
import { Icon } from '@amsterdam/design-system-react/dist/Icon'
import { clsx } from 'clsx'

import { FileListMedia } from './FileListMedia'

import styles from './FileListItem.module.css'

// Although a description list (<dl>, <dt> and <dd>) would be more semantically correct than an unordered list (<ul> and <li>),
// an unordered list with list items is used here because NVDA currently (16-9-2025) reads the number of items in a description list incorrectly.

export type FileListItemProps = HTMLAttributes<HTMLLIElement> & {
  className?: string
  deleteButtonId: string
  errorMessage?: string
  file: File | { name: string }
  labels: {
    actionButtonCancelLabel?: string
    actionButtonDeleteLabel: string
    progressFinishedLabel: string
    progressLoadingLabel: string
  }
  onDelete?: () => void
  status: 'pending' | 'uploading' | 'success' | 'error'
}

export const FileListItem = ({
  className,
  deleteButtonId,
  errorMessage,
  file,
  labels,
  onDelete,
  status,
}: FileListItemProps) => {
  const { actionButtonCancelLabel, actionButtonDeleteLabel, progressFinishedLabel, progressLoadingLabel } = labels

  const isError = status === 'error'
  const isFinished = status === 'success'

  const actionButtonLabel = isFinished || isError ? actionButtonDeleteLabel : actionButtonCancelLabel
  const progressLabel = isFinished ? progressFinishedLabel : progressLoadingLabel

  return (
    <li
      className={clsx(
        styles.item,
        {
          [styles.itemWithError]: errorMessage,
        },
        className,
      )}
    >
      <div className={styles.imageContainer}>
        {isError ? <Icon className={styles.icon} size="heading-1" svg={WarningIcon} /> : <FileListMedia file={file} />}
      </div>

      <div className={styles.description}>
        <span>{file.name}</span>

        <span
          className={clsx({
            [styles.errorMessage]: isError,
            [styles.statusMessage]: !isError,
          })}
        >
          {isError ? errorMessage : progressLabel}
        </span>
      </div>

      {actionButtonLabel && (
        <Button
          className={styles.deleteButton}
          disabled={!onDelete}
          id={deleteButtonId}
          onClick={() => onDelete?.()}
          variant="secondary"
        >
          {actionButtonLabel} <span className="ams-visually-hidden">{file.name}</span>
        </Button>
      )}
    </li>
  )
}
