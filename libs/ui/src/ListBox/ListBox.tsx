import type { HTMLAttributes, PropsWithChildren } from 'react'

import styles from './ListBox.module.css'
import { ListBoxOption } from './ListBoxOption'

type Props = PropsWithChildren<HTMLAttributes<HTMLUListElement>>

export const ListBoxRoot = ({ children, ...restProps }: Props) => (
  <ul className={styles.list} {...restProps}>
    {children}
  </ul>
)

export const ListBox = Object.assign(ListBoxRoot, { Option: ListBoxOption })
