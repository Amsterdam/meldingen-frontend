'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { FormOutput } from '@meldingen/api-client'
import { getFormByFormId } from '@meldingen/api-client'
import { Grid } from '@meldingen/ui'

import { useMeldingContext } from '../../context/MeldingContextProvider'
import mockData from '../../mocks/wizard-test.json'

import { BackLink } from './_components/BackLink'

const FormRenderer = dynamic(() => import('@meldingen/formio').then((mod) => mod.FormRenderer), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

const formOptions = {
  language: 'nl',
  i18n: {
    nl: {
      next: 'Volgende vraag',
      submit: 'Volgende vraag',
    },
  },
}

// Formio doesn't export the Form instance type yet,
// so we define the necessary attributes here for now.
type FormInstance = {
  page: number
  setPage: (page: number) => void
}

const AanvullendeVragen = () => {
  const [page, setPage] = useState<number>(0)
  const [formData, setFormData] = useState<FormOutput>()
  const formInstance = useRef<FormInstance | null>(null)
  const router = useRouter()
  const { data } = useMeldingContext()

  const handleClick = () => {
    if (formInstance.current) {
      formInstance.current.setPage(page - 1)
      setPage(page - 1)
    }
  }

  const handleFormReady = (instance: FormInstance) => {
    setPage(instance.page)
    formInstance.current = instance
  }

  const handleSubmit = () => {
    router.push('/bedankt')
  }

  useEffect(() => {
    const classification = data?.classification

    if (classification) {
      getFormByFormId({ formId: classification }).then((response) => setFormData(response))
    } else {
      setFormData(mockData)
    }
  }, [data])

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        <BackLink page={page} handleClick={handleClick} />
        <FormRenderer
          form={formData}
          formReady={handleFormReady}
          onNextPage={(instance: FormInstance) => setPage(instance.page)}
          onSubmit={handleSubmit}
          options={formOptions}
        />
      </Grid.Cell>
    </Grid>
  )
}

export default AanvullendeVragen
