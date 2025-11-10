import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { AnswerQuestionOutput, FormOutput, FormPanelComponentOutput } from '@meldingen/api-client'
import { getFormClassificationByClassificationId, getMeldingByMeldingIdAnswersMelder } from '@meldingen/api-client'

import { postForm } from './actions'
import { AdditionalQuestions } from './AdditionalQuestions'
import { COOKIES } from 'apps/melding-form/src/constants'

export const dynamic = 'force-dynamic'

const getNextPanelPath = (classificationId: number, currentPanelIndex: number, formData: FormOutput) => {
  if (currentPanelIndex === formData.components.length - 1) return '/locatie'

  return `/aanvullende-vragen/${classificationId}/${formData.components[currentPanelIndex + 1].key}`
}

const getPreviousPanelPath = (classificationId: number, currentPanelIndex: number, formData: FormOutput) => {
  if (currentPanelIndex === 0) return '/'

  return `/aanvullende-vragen/${classificationId}/${formData.components[currentPanelIndex - 1].key}`
}

type FormOutputWithoutPanelComponents = Exclude<FormOutput['components'][number], FormPanelComponentOutput>

const getFormComponents = (components: FormOutputWithoutPanelComponents[], answers?: AnswerQuestionOutput[]) =>
  components.map((component) => {
    const answer = answers?.find((answer) => answer.question.id === component.question)

    // Prefill if answer exists, otherwise return component without defaultValue(s)
    if (component.type === 'selectboxes' && answer) {
      const defaultValues = answer.text.split(',').map((value) => value.trim())
      return { ...component, defaultValues }
    }
    return answer ? { ...component, defaultValue: answer.text } : component
  })

type Params = Promise<{
  classificationId: number
  panelId: string
}>

export default async ({ params }: { params: Params }) => {
  const { classificationId, panelId } = await params

  const { data, error } = await getFormClassificationByClassificationId({
    path: { classification_id: classificationId },
  })

  if (error) throw new Error('Failed to fetch form by classification.')

  if (data?.components[0].type !== 'panel') return redirect('/locatie')

  // Get current panel components
  const currentPanelIndex = data.components.findIndex((component) => component.key === panelId)
  const panel = data.components[currentPanelIndex] as FormPanelComponentOutput
  const panelComponents = panel.components
  const panelLabel = panel.label

  // Check if answers already exist and prefill if so
  const cookieStore = await cookies()
  // We check for the existence of these cookies in our proxy, so non-null assertion is safe here.
  const meldingId = cookieStore.get(COOKIES.ID)!.value
  const token = cookieStore.get(COOKIES.TOKEN)!.value

  const { data: answers } = await getMeldingByMeldingIdAnswersMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  const formComponents = getFormComponents(panelComponents, answers)

  // Pass question and answer ID pairs to the action
  const questionAndAnswerIdPairs = answers?.map((answer) => ({
    answerId: answer.id,
    questionId: answer.question.id,
  }))

  // Pass question keys and ids to the action
  const questionKeysAndIds = panelComponents.map(({ key, question }) => ({
    id: question,
    key: key,
  }))

  // Pass required questions keys to the action
  const requiredQuestionKeys = panelComponents.filter((question) => question.validate?.required).map(({ key }) => key)

  // Pass isLastPanel to the action
  const isLastPanel = currentPanelIndex === data.components.length - 1

  // Pass last panel path to the action
  const lastPanelPath = `/aanvullende-vragen/${classificationId}/${data.components[data.components.length - 1].key}`

  // Pass next panel path to the action
  const nextPanelPath = getNextPanelPath(classificationId, currentPanelIndex, data)

  const extraArgs = {
    isLastPanel,
    lastPanelPath,
    nextPanelPath,
    questionKeysAndIds,
    questionAndAnswerIdPairs,
    requiredQuestionKeys,
  }

  const postFormWithExtraArgs = postForm.bind(null, extraArgs)

  // Pass previous panel path to the Aanvullende vragen component
  const previousPanelPath = getPreviousPanelPath(classificationId, currentPanelIndex, data)

  return (
    <AdditionalQuestions
      action={postFormWithExtraArgs}
      formComponents={formComponents}
      panelLabel={panelLabel}
      previousPanelPath={previousPanelPath}
    />
  )
}
