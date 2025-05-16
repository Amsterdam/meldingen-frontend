import clsx from 'clsx'
import { forwardRef } from 'react'
import type { ForwardedRef, HTMLAttributes, PropsWithChildren } from 'react'

import styles from './SummaryList.module.css'
export type SummaryListTermProps = PropsWithChildren<HTMLAttributes<HTMLElement>>

export const SummaryListTerm = forwardRef(
  ({ children, className, ...restProps }: SummaryListTermProps, ref: ForwardedRef<HTMLElement>) => (
    <dt {...restProps} className={clsx(styles.term, className)} ref={ref}>
      {children}
    </dt>
  ),
)

SummaryListTerm.displayName = 'SummaryList.Term'
