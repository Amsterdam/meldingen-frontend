import clsx from 'clsx'
import { forwardRef } from 'react'
import type { ForwardedRef, HTMLAttributes, PropsWithChildren } from 'react'

import { SummaryListDescription } from './SummaryListDescription'
import { SummaryListItem } from './SummaryListItem'
import { SummaryListTerm } from './SummaryListTerm'

import styles from './SummaryList.module.css'

export type SummaryListProps = PropsWithChildren<HTMLAttributes<HTMLDListElement>>

const SummaryListRoot = forwardRef(
  ({ children, className, ...restProps }: SummaryListProps, ref: ForwardedRef<HTMLDListElement>) => (
    <dl {...restProps} className={clsx(styles.list, className)} ref={ref}>
      {children}
    </dl>
  ),
)

SummaryListRoot.displayName = 'SummaryList'

export const SummaryList = Object.assign(SummaryListRoot, {
  Description: SummaryListDescription,
  Item: SummaryListItem,
  Term: SummaryListTerm,
})
