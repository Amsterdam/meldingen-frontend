'use client'

import { PageHeader } from '@amsterdam/design-system-react'
import { PropsWithChildren } from 'react'

import { LinkComponent } from './LinkComponent'

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
