'use client'
import { Icon, Link } from '@amsterdam/design-system-react'
import { ChevronLeftIcon } from '@amsterdam/design-system-react-icons'
import clsx from 'clsx'
import NextLink from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

import styles from './BackLink.module.css'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> & {
  href: string
}

export const BackLink = ({ children, className, href, ...restProps }: Props) => (
  <NextLink href={href} legacyBehavior passHref>
    <Link {...restProps} className={clsx(styles.link, className)}>
      <Icon svg={ChevronLeftIcon} size="level-5" />
      {children}
    </Link>
  </NextLink>
)
