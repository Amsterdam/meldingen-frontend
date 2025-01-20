import type { PropsWithChildren, LiHTMLAttributes } from 'react'

import styles from './ListBox.module.css'

type Props = PropsWithChildren<LiHTMLAttributes<HTMLLIElement>>

export const ListBoxOption = ({ children, ...restProps }: Props) => (
  <li className={styles.option} {...restProps}>
    {children}
  </li>
)
