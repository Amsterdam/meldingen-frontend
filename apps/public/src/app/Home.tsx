'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import { postMelding } from '@meldingen/api-client'
import { Grid } from '@meldingen/ui'

import { useMeldingContext } from '../context/MeldingContextProvider'

import type { StaticFormWithSubmit } from './page'

const FormRenderer = dynamic(() => import('@meldingen/formio').then((mod) => mod.FormRenderer), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

export const Home = ({ formData }: { formData: StaticFormWithSubmit }) => {
  const router = useRouter()
  const { setData } = useMeldingContext()

  const onSubmit = ({ data }: { [key: string]: any }) => {
    const firstKey = Object.keys(data)[0]

    postMelding({ requestBody: { text: data[firstKey] } }).then(({ id, token, classification }) => {
      setData({ id, token, classification })
      router.push('/aanvullende-vragen')
    })
  }

  // TODO: ESLint test, remove when ESlint works
  // var hello = (name: any) => {
  //   return 'Hello, ' + name + '!'
  // }

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        <FormRenderer form={formData} onSubmit={onSubmit} options={{ noAlerts: true }} />
      </Grid.Cell>
    </Grid>
  )
}
