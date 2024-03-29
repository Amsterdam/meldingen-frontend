'use client'

import dynamic from 'next/dynamic'

import { Grid } from '@meldingen/ui'

import mockData from '../../src/mocks/formio-output.json'

const FormRenderer = dynamic(() => import('@meldingen/formio').then((mod) => mod.FormRenderer), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

export default function Home() {
  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        <FormRenderer form={mockData} />
      </Grid.Cell>
    </Grid>
  )
}
