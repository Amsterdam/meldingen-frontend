'use client'

import { Paragraph } from '@amsterdam/design-system-react'
import NextLink from 'next/link'

import { Grid } from '@meldingen/ui'

import { test } from './actions'

export const Overview = ({ data }: { data: any }) => {
  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <Paragraph>Back Office</Paragraph>
        <NextLink href="/test">Naar test pagina</NextLink>
        <form action={test}>
          <input type="text" name="melding" />
          <button type="submit">Verstuur melding</button>
        </form>
        <ul>
          {data.map((melding: any) => (
            <li key={melding.id}>{melding.text}</li>
          ))}
        </ul>
      </Grid.Cell>
    </Grid>
  )
}
