import type { ReactNode } from 'react'

import { Grid } from '@meldingen/ui'

import { BackLink } from './BackLink'

type Props = {
  backLink: {
    href: string
    label: string
  }
  children: ReactNode
}

export const PageWrapper = ({ backLink, children }: Props) => (
  <div className="ams-page__area--body">
    <BackLink href={backLink.href}>{backLink.label}</BackLink>
    <Grid as="main">
      <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
        {children}
      </Grid.Cell>
    </Grid>
  </div>
)
