'use client'

import { Button, Paragraph } from '@amsterdam/design-system-react'
import { Grid } from '@meldingen/ui'
import { useRouter } from 'next/navigation'
import { SessionProvider, signOut, useSession } from 'next-auth/react'

export const Overview = () => {
  const { status } = useSession()
  const router = useRouter()

  return (
    <SessionProvider>
      <Grid paddingBottom="large" paddingTop="medium">
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
          <div className="h-screen flex items-center justify-center">
            {status === 'authenticated' ? (
              <Button onClick={() => signOut()}>Logout</Button>
            ) : (
              <Button onClick={() => router.push('/api/auth/signin/credentials')}>login</Button>
            )}
          </div>
          <Paragraph>Back Office</Paragraph>
          <Button onClick={() => router.push('/detail')}>Details</Button>
        </Grid.Cell>
      </Grid>
    </SessionProvider>
  )
}
