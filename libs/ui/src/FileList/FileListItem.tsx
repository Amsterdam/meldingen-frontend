import { Badge } from '@amsterdam/design-system-react/dist/Badge'
import { Button } from '@amsterdam/design-system-react/dist/Button'
import { HTMLAttributes } from 'react'

import { formatFileSize } from './formatFileSize'

import styles from './FileList.module.css'

export type FileListItemProps = HTMLAttributes<HTMLLIElement> & {
  file: File
  status?: 'uploading' | 'error' | 'success'
  onDelete?: () => void
}

export const FileListItem = ({ file, onDelete, status }: FileListItemProps) => {
  const imageUrl = URL.createObjectURL(file)

  const handleDelete = () => {
    URL.revokeObjectURL(imageUrl)
    onDelete?.()
  }

  return (
    <div className={styles.item}>
      <dt className={styles.term}>{file.name}</dt>
      <dd className={`${styles.description} ${styles.imageDescription}`}>
        <img src={imageUrl} alt="" className={styles.thumbnail} />
      </dd>
      <dd className={styles.description}>{formatFileSize(file.size)}</dd>
      {status && (
        <dd className={styles.description}>
          <Badge label="Status" />
        </dd>
      )}
      <dd className={styles.description}>
        <Button variant="tertiary" onClick={handleDelete}>
          Verwijderen
        </Button>
      </dd>
    </div>
  )
}
