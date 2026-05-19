'use client'

import type { AnchorHTMLAttributes, PropsWithChildren } from 'react'

import { PageHeader } from '@amsterdam/design-system-react'
import NextLink from 'next/link'

const LinkComponent = (props: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) => (
  <NextLink href="/" {...props} />
)

export const Header = () => (
  <PageHeader brandName="Melding openbare ruimte" className="ams-mb-l" logoLinkComponent={LinkComponent} />
)
