import type { ForwardedRef, LiHTMLAttributes, PropsWithChildren } from 'react'
import { forwardRef } from 'react'

import styles from './ListBox.module.css'

type Props = PropsWithChildren<LiHTMLAttributes<HTMLLIElement>>

export const ListBoxOption = forwardRef(({ children, ...restProps }: Props, ref: ForwardedRef<HTMLLIElement>) => (
  <li {...restProps} ref={ref} className={styles.option}>
    {children}
  </li>
))
