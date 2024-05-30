'use client'

import dynamic from 'next/dynamic'

import { Grid } from '@meldingen/ui'

import mockData from '../mocks/wizard-test.json'

import { AdditionalQuestionsPage } from './additionalQuestions/page'

const FormRenderer = dynamic(() => import('@meldingen/formio').then((mod) => mod.FormRenderer), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

const Home = () => (
  <Grid paddingBottom="large" paddingTop="medium">
    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      <FormRenderer form={mockData} />
      <AdditionalQuestionsPage />
    </Grid.Cell>
  </Grid>
)

export default Home
