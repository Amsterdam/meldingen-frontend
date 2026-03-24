import type { AnchorHTMLAttributes } from 'react'

import { clsx } from 'clsx'
import NextLink from 'next/link'

import styles from './CancelLink.module.css'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> & {
  href: string
}

export const CancelLink = ({ className, href, ...restProps }: Props) => (
  /*
   * Apply Amsterdam Design System Link styling to NextLink.
   * Using a className avoids issues caused by the `legacyBehavior` prop.
   */
  <NextLink className={clsx('ams-link', className, styles.link)} href={href} {...restProps} />
)
