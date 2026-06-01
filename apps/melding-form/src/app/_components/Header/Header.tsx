'use client'

import { PageHeader } from '@amsterdam/design-system-react'
import NextLink from 'next/link'

export const Header = () => (
  <PageHeader
    brandName="Melding openbare ruimte"
    className="ams-mb-l"
    logoLinkComponent={({ href = '/', ...props }) => <NextLink href={href} {...props} />}
  />
)
