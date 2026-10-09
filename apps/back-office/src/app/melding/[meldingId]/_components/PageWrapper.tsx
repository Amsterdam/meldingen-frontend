import type { ReactNode } from 'react'

import { Grid } from '@meldingen/ui'

import { BackLink } from './BackLink'

type Props = {
  backLink: {
    href: string
    label: string
  }
  children: ReactNode
  documentTitle?: string
}

export const PageWrapper = ({ backLink, children, documentTitle }: Props) => (
  <div className="ams-page__area--body">
    {documentTitle && <title>{documentTitle}</title>}
    <BackLink href={backLink.href}>{backLink.label}</BackLink>
    <Grid as="main">
      <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
        {children}
      </Grid.Cell>
    </Grid>
  </div>
)
