'use client'

import { PageHeader } from '@amsterdam/design-system-react'
import NextLink from 'next/link'
import { PropsWithChildren } from 'react'

export const Header = ({ children }: PropsWithChildren) => (
  <PageHeader
    brandName="Meldingen"
    className="ams-page__area--header"
    logoLinkComponent={({ href = '/', ...props }) => <NextLink href={href} {...props} />}
    noMenuButtonOnWideWindow
  >
    {children}
  </PageHeader>
)
