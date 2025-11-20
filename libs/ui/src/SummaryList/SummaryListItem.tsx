import type { ForwardedRef, HTMLAttributes, PropsWithChildren } from 'react'

import { clsx } from 'clsx'
import { forwardRef } from 'react'

import styles from './SummaryList.module.css'

export type SummaryListItemProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

export const SummaryListItem = forwardRef(
  ({ children, className, ...restProps }: SummaryListItemProps, ref: ForwardedRef<HTMLDivElement>) => (
    <div {...restProps} className={clsx(styles.item, className)} ref={ref}>
      {children}
    </div>
  ),
)

SummaryListItem.displayName = 'SummaryList.Item'
