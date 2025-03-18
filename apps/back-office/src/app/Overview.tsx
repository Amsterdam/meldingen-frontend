'use client'

import { Paragraph } from '@amsterdam/design-system-react'
import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { Grid } from '@meldingen/ui'

export const Overview = () => {
  const session = useSession()

  useEffect(() => {
    if (session?.data?.error === 'RefreshAccessTokenError') {
      signIn() // Force sign in to hopefully resolve error
    }
  }, [session])

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <Paragraph>Back Office</Paragraph>
      </Grid.Cell>
    </Grid>
  )
}
