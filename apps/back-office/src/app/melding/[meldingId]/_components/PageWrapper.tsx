import type { ReactNode } from 'react'

import { Grid } from '@meldingen/ui'

import { BackLink as BackLinkComponent } from './BackLink'

export type BackLink = {
  href: string
  label: string
}
type Props = {
  backLink: BackLink
  children?: ReactNode
  documentTitle?: string
}

export const PageWrapper = ({ backLink, children, documentTitle }: Props) => (
  <div className="ams-page__area--body">
    {documentTitle && <title>{documentTitle}</title>}
    {backLink && <BackLinkComponent href={backLink.href}>{backLink.label}</BackLinkComponent>}
    <Grid as="main">
      <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
        {children}
      </Grid.Cell>
    </Grid>
  </div>
)
