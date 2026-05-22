'use client'

import type { PageHeaderProps } from '@amsterdam/design-system-react'

import { PageHeader } from '@amsterdam/design-system-react'
import NextLink from 'next/link'

export const Header = (props: PageHeaderProps) => (
  <PageHeader
    {...props}
    brandName="Meldingen"
    className="ams-page__area--header"
    logoLinkComponent={({ href = '/', ...props }) => <NextLink href={href} {...props} />}
    noMenuButtonOnWideWindow
  />
)
