import type { ReactNode } from 'react'

import { Grid } from '@meldingen/ui'

import { BackLink } from './BackLink'
import { ErrorDocumentTitle } from './ErrorDocumentTitle'

type Props = {
  backLink: {
    href: string
    label: string
  }
  children: ReactNode
  errorDocumentTitle?: string
}

export const PageWrapper = ({ backLink, children, errorDocumentTitle }: Props) => (
  <div className="ams-page__area--body">
    {errorDocumentTitle && <ErrorDocumentTitle title={errorDocumentTitle} />}
    <BackLink href={backLink.href}>{backLink.label}</BackLink>
    <Grid as="main">
      <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
        {children}
      </Grid.Cell>
    </Grid>
  </div>
)
