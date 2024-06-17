'use client'

import dynamic from 'next/dynamic'

import { getFormPrimary } from '@meldingen/api-client'
import { Grid } from '@meldingen/ui'

import mockData from '../mocks/wizard-test.json'

const FormRenderer = dynamic(() => import('@meldingen/formio').then((mod) => mod.FormRenderer), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

const Home = () => {
  // eslint-disable-next-line no-console
  getFormPrimary().then((response) => console.log(response))

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        <FormRenderer form={mockData} />
      </Grid.Cell>
    </Grid>
  )
}

export default Home
