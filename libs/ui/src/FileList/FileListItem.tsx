import { Badge } from '@amsterdam/design-system-react/dist/Badge'
import { Button } from '@amsterdam/design-system-react/dist/Button'
import { HTMLAttributes } from 'react'

import { formatFileSize } from './formatFileSize'

import styles from './FileList.module.css'

export type FileListItemProps = HTMLAttributes<HTMLLIElement> & {
  file: File
  onDelete?: () => void
}

export const FileListItem = ({ file, onDelete }: FileListItemProps) => (
  <div className={styles.item}>
    <dt>{file.name}</dt>
    <dd className={styles.noShrink}>thumbnail</dd>
    <dd className={styles.noShrink}>{formatFileSize(file.size)}</dd>
    <dd className={styles.noShrink}>
      <Badge label="Status" />
    </dd>
    <dd>
      <Button variant="tertiary" onClick={onDelete}>
        Verwijderen
      </Button>
    </dd>
  </div>
)
