'use client'

import type { ComponentSchema } from 'formiojs'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { StaticFormOutput } from '@meldingen/api-client'
import { getStaticFormByFormType, postMelding } from '@meldingen/api-client'
import { Grid } from '@meldingen/ui'

import { useMeldingContext } from '../context/MeldingContextProvider'

type StaticFormWithSubmit = Omit<StaticFormOutput, 'components'> & { components: ComponentSchema[] }

// import mockData from '../mocks/wizard-test.json'

const FormRenderer = dynamic(() => import('@meldingen/formio').then((mod) => mod.FormRenderer), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

const addSubmitButton = (form: StaticFormOutput): StaticFormWithSubmit => ({
  ...form,
  components: [
    ...form.components,
    {
      type: 'button',
      key: 'submit',
      label: 'Submit',
      input: false,
    },
  ],
})

const Home = () => {
  const [primaryForm, setPrimaryForm] = useState<StaticFormWithSubmit | null>(null)
  const router = useRouter()
  const { setData } = useMeldingContext()

  const onSubmit = ({ data }: { [key: string]: any }) => {
    postMelding({ requestBody: { text: data[Object.keys(data)[0]] } }).then(({ id, token, classification }) => {
      setData({ id, token, classification })
      router.push('/aanvullende-vragen')
    })
  }

  if (!primaryForm) {
    getStaticFormByFormType({ formType: 'primary' }).then((response) => {
      const responseWithSubmitButton = addSubmitButton(response)

      setPrimaryForm(responseWithSubmitButton)
    })
  }

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        <FormRenderer form={primaryForm} onSubmit={onSubmit} />
      </Grid.Cell>
    </Grid>
  )
}

export default Home
