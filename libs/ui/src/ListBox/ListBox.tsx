import type { ForwardedRef, HTMLAttributes, PropsWithChildren } from 'react'

import { clsx } from 'clsx'
import { forwardRef } from 'react'

import { ListBoxOption } from './ListBoxOption'

import styles from './ListBox.module.css'

type Props = PropsWithChildren<HTMLAttributes<HTMLUListElement>>

export const ListBoxRoot = forwardRef(
  ({ children, className, ...restProps }: Props, ref: ForwardedRef<HTMLUListElement>) => (
    <ul {...restProps} className={clsx(styles.list, className)} ref={ref}>
      {children}
    </ul>
  ),
)

export const ListBox = Object.assign(ListBoxRoot, { Option: ListBoxOption })
