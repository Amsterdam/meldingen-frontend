import { HTMLAttributes, PropsWithChildren } from 'react'

import { FileListItem } from './FileListItem'

import styles from './FileList.module.css'

type Props = PropsWithChildren<HTMLAttributes<HTMLDListElement>>

export const FileListRoot = ({ children, ...restProps }: Props) => {
  return (
    <dl className={styles.list} {...restProps}>
      {children}
    </dl>
  )
}

export const FileList = Object.assign(FileListRoot, {
  Item: FileListItem,
})
