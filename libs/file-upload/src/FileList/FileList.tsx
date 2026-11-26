import type { HTMLAttributes, PropsWithChildren } from 'react'

import { FileListItem } from './FileListItem'

import styles from './FileList.module.css'

// Although a description list (<dl>) would be more semantically correct than an unordered list (<ul>),
// an unordered list is used here because NVDA currently (16-9-2025) reads the number of items in a description list incorrectly.

type Props = PropsWithChildren<HTMLAttributes<HTMLUListElement>>

export const FileListRoot = ({ children, ...restProps }: Props) => (
  // Safari removes the list semantics from lists styled with `list-style: none`.
  // The explicit role restores them, so VoiceOver also announces the list and its number of items.
  // eslint-disable-next-line jsx-a11y/no-redundant-roles
  <ul className={styles.list} role="list" {...restProps}>
    {children}
  </ul>
)

export const FileList = Object.assign(FileListRoot, {
  Item: FileListItem,
})
