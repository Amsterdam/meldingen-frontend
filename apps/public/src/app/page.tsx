'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { StaticFormOutput } from '@meldingen/api-client'
import { getStaticFormByFormType, postMelding } from '@meldingen/api-client'
import { Grid } from '@meldingen/ui'

import { useAppContext } from '../context/context'

// import mockData from '../mocks/wizard-test.json'

const FormRenderer = dynamic(() => import('@meldingen/formio').then((mod) => mod.FormRenderer), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

const addSubmitButton = (form: StaticFormOutput) => ({
  ...form,
  components: [
    ...form.components,
    {
      type: 'button',
      key: 'submit',
      label: 'Submit',

      description: '',

      input: false,
      autoExpand: false,
      showCharCount: false,
      position: 0,
    },
  ],
})

const Home = () => {
  const [primaryForm, setPrimaryForm] = useState<StaticFormOutput | null>(null)
  const router = useRouter()
  const { setMeldingInfo } = useAppContext()

  const onSubmit = ({ data: formInputData }: { [key: string]: any[] }) => {
    const primaryQuestionKey = primaryForm?.components[0].key as keyof typeof formInputData

    if (!primaryQuestionKey) throw new Error('Primary question key not found')

    postMelding({ requestBody: { text: formInputData[primaryQuestionKey] } }).then((response) => {
      setMeldingInfo({ id: response.id, token: response.token, classification: response.classification })
      router.push('/aanvullende-vragen')
    })
  }

  if (!primaryForm) {
    getStaticFormByFormType({ formType: 'primary' }).then((response) => {
      const withSubmitButton = addSubmitButton(response)

      setPrimaryForm(withSubmitButton)
    })
  }

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        <FormRenderer form={primaryForm} onSubmit={onSubmit} options={{ noAlerts: true }} />
      </Grid.Cell>
    </Grid>
  )
}

export default Home
