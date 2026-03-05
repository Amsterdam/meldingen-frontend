'use client'

import { PageHeader } from '@amsterdam/design-system-react'
import NextLink from 'next/link'
import { AnchorHTMLAttributes, PropsWithChildren } from 'react'

const LinkComponent = (props: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) => (
  <NextLink href="/" {...props} />
)

export const Header = ({ children }: PropsWithChildren) => (
  <PageHeader
    brandName="Meldingen"
    className="ams-page__area--header"
    logoLinkComponent={LinkComponent}
    noMenuButtonOnWideWindow
  >
    {children}
  </PageHeader>
)
