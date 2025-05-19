import clsx from 'clsx'
import type { ForwardedRef, HTMLAttributes, PropsWithChildren } from 'react'
import { forwardRef } from 'react'

import { ListBoxOption } from './ListBoxOption'

import styles from './ListBox.module.css'

type Props = PropsWithChildren<HTMLAttributes<HTMLUListElement>>

export const ListBoxRoot = forwardRef(
  ({ children, className, ...restProps }: Props, ref: ForwardedRef<HTMLUListElement>) => (
    <ul {...restProps} ref={ref} className={clsx(styles.list, className)}>
      {children}
    </ul>
  ),
)

export const ListBox = Object.assign(ListBoxRoot, { Option: ListBoxOption })
