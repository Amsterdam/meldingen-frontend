'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { FormOutput } from '@meldingen/api-client'
import {
  getFormClassificationByClassificationId,
  postMeldingByMeldingIdQuestionByQuestionId,
  putMeldingByMeldingIdAnswerQuestions,
} from '@meldingen/api-client'
import { Grid } from '@meldingen/ui'

import { useMeldingContext } from '../../context/MeldingContextProvider'
import mockData from '../../mocks/mockFormData.json'

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

type AnswerObject = {
  [key: string]: string
}

type NextPageInstance = FormInstance & { submission: { data: AnswerObject } }

type SubmitInstance = FormInstance & { data: AnswerObject }

const transformAnswer = (answer: string | { [key: string]: string }) => {
  if (typeof answer === 'object') {
    const checkedAnswers = Object.keys(answer).filter((key) => answer[key])

    return checkedAnswers.join(', ')
  }

  return answer
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

  const postAnswer = (answerObj: AnswerObject, currentPage?: number) => {
    if (formData && data) {
      // handleOnNextPage passes what page it's on.
      // handleSubmit doesn't, but that's always the last page.
      const selectedPage = currentPage ?? formData.components.length - 1

      // @ts-expect-error: TODO: FormComponentOutput | FormPanelComponentOutput means you can only use attrs present in both...
      formData.components[selectedPage].components.forEach((component) => {
        // Transform all answers to strings (including checkbox objects)
        const answer = transformAnswer(answerObj[component.key])

        // Filter out empty answers
        if (answer.length === 0) return null

        const { id, token } = data

        return postMeldingByMeldingIdQuestionByQuestionId({
          body: { text: answer },
          path: {
            melding_id: id,
            question_id: component.question,
          },
          query: {
            token,
          },
        })
      })
    }
  }

  const handleOnNextPage = (instance: NextPageInstance) => {
    setPage(instance.page)
    postAnswer(instance.submission.data, instance.page - 1)
  }

  const handleSubmit = (instance: SubmitInstance) => {
    postAnswer(instance.data)
    // Call to let BE know we're at the end of this form
    if (data) {
      const { id, token } = data
      putMeldingByMeldingIdAnswerQuestions({
        path: {
          melding_id: id,
        },
        query: {
          token,
        },
      })
    }
    router.push('/bedankt')
  }

  useEffect(() => {
    const classification = data?.classification

    if (classification) {
      getFormClassificationByClassificationId({ path: { classification_id: classification } }).then(
        ({ data: formDataByClassification }) => setFormData(formDataByClassification),
      )
    } else {
      // TODO: this should be a default form we get from the api
      setFormData(mockData)
    }
  }, [data])

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        <BackLink page={page} handleClick={handleClick} />
        {formData ? (
          <FormRenderer
            form={formData}
            formReady={handleFormReady}
            onNextPage={handleOnNextPage}
            onSubmit={handleSubmit}
            options={formOptions}
          />
        ) : (
          <p>Loading...</p>
        )}
      </Grid.Cell>
    </Grid>
  )
}

export default AanvullendeVragen
