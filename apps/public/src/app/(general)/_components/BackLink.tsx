'use client'

import { Icon, Link } from '@amsterdam/design-system-react'
import { ChevronLeftIcon } from '@amsterdam/design-system-react-icons'
import NextLink from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

import styles from './BackLink.module.css'

export const BackLink = ({
  children,
  className,
  href,
  ...restProps
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
  <NextLink href={href} legacyBehavior passHref>
    <Link {...restProps} className={`${styles.link} ${className ?? ''}`} href="dummy-href">
      <Icon svg={ChevronLeftIcon} size="level-5" />
      {children}
    </Link>
  </NextLink>
)
