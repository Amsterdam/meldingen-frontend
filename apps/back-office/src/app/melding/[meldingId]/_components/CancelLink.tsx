import type { AnchorHTMLAttributes } from 'react'

import { clsx } from 'clsx'
import NextLink from 'next/link'

import { Link } from '@meldingen/ui'

import styles from './CancelLink.module.css'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> & {
  href: string
}

export const CancelLink = ({ className, href, ...restProps }: Props) => (
  <NextLink href={href} legacyBehavior passHref>
    <Link className={clsx(className, styles.link)} {...restProps} />
  </NextLink>
)
