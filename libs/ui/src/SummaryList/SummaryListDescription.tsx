import type { ForwardedRef, HTMLAttributes, PropsWithChildren } from 'react'

import { clsx } from 'clsx'
import { forwardRef } from 'react'

import styles from './SummaryList.module.css'

export type SummaryListDescriptionProps = PropsWithChildren<HTMLAttributes<HTMLElement>>

export const SummaryListDescription = forwardRef(
  ({ children, className, ...restProps }: SummaryListDescriptionProps, ref: ForwardedRef<HTMLElement>) => (
    <dd {...restProps} className={clsx(styles.description, className)} ref={ref}>
      {children}
    </dd>
  ),
)

SummaryListDescription.displayName = 'SummaryList.Description'
