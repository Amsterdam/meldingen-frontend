import { Badge, BadgeProps } from '@amsterdam/design-system-react/dist/Badge'
import { Button } from '@amsterdam/design-system-react/dist/Button'
import useIsAfterBreakpoint from '@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint'
import { ErrorMessage } from '@amsterdam/design-system-react/dist/ErrorMessage'
import { Image } from '@amsterdam/design-system-react/dist/Image'
import { clsx } from 'clsx'
import { HTMLAttributes } from 'react'

import { formatFileSize } from './formatFileSize'

import styles from './FileList.module.css'

const badgeColors: Record<string, BadgeProps['color']> = {
  uploading: 'orange',
  error: 'red',
  success: undefined,
}

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
  const imageUrl = URL.createObjectURL(file)

  const handleDelete = () => {
    URL.revokeObjectURL(imageUrl)
    onDelete?.()
  }

  const hasError = Boolean(errorMessage)

  const isNotNarrowWindow = useIsAfterBreakpoint('medium')

  return (
    <div className={styles.container}>
      <div className={clsx(styles.item, hasError && styles.itemWithError)}>
        <dt className={styles.term}>{file.name}</dt>
        <dd className={styles.imageDescription}>
          <Image src={imageUrl} alt="" aspectRatio={isNotNarrowWindow ? '1:1' : '16:9'} />
        </dd>
        <dd className={styles.description}>{formatFileSize(file.size)}</dd>
        {status && (
          <dd className={styles.description}>
            <Badge label={statusLabels?.[status] ?? status} color={badgeColors[status]} />
          </dd>
        )}
        <dd className={styles.description}>
          <Button variant="secondary" onClick={handleDelete}>
            {deleteButtonLabel} <span className="ams-visually-hidden">{file.name}</span>
          </Button>
        </dd>
        {hasError && (
          <dd className={styles.error}>
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </dd>
        )}
      </div>
    </div>
  )
}
