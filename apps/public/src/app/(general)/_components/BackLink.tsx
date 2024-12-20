'use client'

import { Link } from '@amsterdam/design-system-react'
import NextLink from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

export const BackLink = ({
  children,
  href,
  ...restProps
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
  <NextLink href={href} legacyBehavior passHref>
    <Link {...restProps} className="ams-mb--xs" href="dummy-href">
      {children}
    </Link>
  </NextLink>
)
