import { Badge, BadgeProps } from '@amsterdam/design-system-react/dist/Badge'
import { Button } from '@amsterdam/design-system-react/dist/Button'
import useIsAfterBreakpoint from '@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint'
import { ErrorMessage } from '@amsterdam/design-system-react/dist/ErrorMessage'
import { Image } from '@amsterdam/design-system-react/dist/Image'
import { clsx } from 'clsx'
import { HTMLAttributes, useMemo } from 'react'

import { formatFileSize } from './formatFileSize'

import styles from './FileList.module.css'

const badgeColors: Record<string, BadgeProps['color']> = {
  uploading: 'orange',
  error: 'red',
  success: undefined,
}

// Although a description list (<dl>, <dt> and <dd>) would be more semantically correct than an unordered list (<ul> and <li>),
// an unordered list with list items is used here because NVDA currently (16-9-2025) reads the number of items in a description list incorrectly.

export type FileListItemProps = HTMLAttributes<HTMLLIElement> & {
  deleteButtonLabel?: string
  errorMessage?: string
  file: File
  status?: 'uploading' | 'error' | 'success'
  statusLabels?: {
    uploading: string
    error: string
    success: string
  }
  onDelete?: () => void
}

export const FileListItem = ({
  deleteButtonLabel = 'Verwijder',
  errorMessage,
  file,
  onDelete,
  status,
  statusLabels,
}: FileListItemProps) => {
  // Memoize the creation of an object url from the file,
  // to prevent it from creating a new one on every render.
  const imageUrl = useMemo(() => URL.createObjectURL(file), [file])

  const handleDelete = () => {
    URL.revokeObjectURL(imageUrl)
    onDelete?.()
  }

  const hasError = Boolean(errorMessage)

  const isMediumOrWideWindow = useIsAfterBreakpoint('medium')

  return (
    <li className={styles.item}>
      <div className={clsx(styles.container, hasError && styles.containerWithError)}>
        <div className={styles.term}>{file.name}</div>
        <div className={styles.imageDescription}>
          <Image src={imageUrl} alt="" aspectRatio={isMediumOrWideWindow ? '1:1' : '16:9'} />
        </div>
        <div className={styles.description}>{formatFileSize(file.size)}</div>
        {status && (
          <div className={styles.description}>
            <Badge label={statusLabels?.[status] ?? status} color={badgeColors[status]} />
          </div>
        )}
        <div className={styles.description}>
          <Button variant="secondary" onClick={handleDelete}>
            {deleteButtonLabel} <span className="ams-visually-hidden">{file.name}</span>
          </Button>
        </div>
        {hasError && (
          <div className={styles.error}>
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </div>
        )}
      </div>
    </li>
  )
}
