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
    /** Visually hidden text before the error message, e.g. 'Invoerfout', so screen-reader users know it is an error */
    errorPrefix?: string
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
  const { actionButtonCancelLabel, actionButtonDeleteLabel, errorPrefix, progressFinishedLabel, progressLoadingLabel } =
    labels

  const isError = status === 'error'
  const isFinished = status === 'success'
  const errorMessageId = `${deleteButtonId}-error`

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
      <div className={styles.attachmentContainer}>
        {isError ? <Icon className={styles.icon} size="heading-1" svg={WarningIcon} /> : <FileListMedia file={file} />}
      </div>

      <div className={styles.description}>
        <span>{file.name}</span>

        {isError ? (
          <span className={styles.errorMessage} id={errorMessageId}>
            {errorPrefix && (
              <>
                <span className="ams-visually-hidden">{`${errorPrefix}:`}</span>{' '}
              </>
            )}
            {errorMessage}
          </span>
        ) : (
          <span className={styles.statusMessage}>{progressLabel}</span>
        )}
      </div>

      {actionButtonLabel && (
        <Button
          // The error link in the alert leads to this button, so the error is read there as well
          aria-describedby={isError ? errorMessageId : undefined}
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
