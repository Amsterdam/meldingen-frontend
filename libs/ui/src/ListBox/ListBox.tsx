import type { ForwardedRef, HTMLAttributes, PropsWithChildren } from 'react'
import { forwardRef } from 'react'

import styles from './ListBox.module.css'
import { ListBoxOption } from './ListBoxOption'

type Props = PropsWithChildren<HTMLAttributes<HTMLUListElement>>

export const ListBoxRoot = forwardRef(
  ({ children, className, ...restProps }: Props, ref: ForwardedRef<HTMLUListElement>) => (
    <ul {...restProps} ref={ref} className={`${styles.list} ${className ?? ''}`}>
      {children}
    </ul>
  ),
)

export const ListBox = Object.assign(ListBoxRoot, { Option: ListBoxOption })
