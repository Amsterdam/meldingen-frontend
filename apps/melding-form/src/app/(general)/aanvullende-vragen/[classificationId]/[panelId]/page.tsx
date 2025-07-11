import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import type { FormOutput, FormPanelComponentOutput } from '@meldingen/api-client'
import { getFormClassificationByClassificationId } from '@meldingen/api-client'

import { postForm } from './actions'
import { AdditionalQuestions } from './AdditionalQuestions'

export const dynamic = 'force-dynamic'

export const generateMetadata = async () => {
  const t = await getTranslations('additional-questions')

  return {
    title: t('metadata.title'),
  }
}

type Params = Promise<{
  classificationId: number
  panelId: string
}>

const getNextPanelPath = (classificationId: number, currentPanelIndex: number, formData: FormOutput) => {
  if (currentPanelIndex === formData.components.length - 1) return '/locatie'

  return `/aanvullende-vragen/${classificationId}/${formData.components[currentPanelIndex + 1].key}`
}

const getPreviousPanelPath = (classificationId: number, currentPanelIndex: number, formData: FormOutput) => {
  if (currentPanelIndex === 0) return '/'

  return `/aanvullende-vragen/${classificationId}/${formData.components[currentPanelIndex - 1].key}`
}

export default async ({ params }: { params: Params }) => {
  const { classificationId, panelId } = await params

  const { data, error } = await getFormClassificationByClassificationId({
    path: { classification_id: classificationId },
  })

  if (error) throw new Error('Failed to fetch form by classification.')

  if (data?.components[0].type !== 'panel') return redirect('/locatie')

  // Get current panel questions
  const currentPanelIndex = data.components.findIndex((component) => component.key === panelId)
  const panel = data.components[currentPanelIndex] as FormPanelComponentOutput
  const panelQuestions = panel.components

  // Pass question ids to the action
  const questionIds = panelQuestions.map((question) => ({
    key: question.key,
    id: question.question,
  }))

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
    questionIds,
  }

  const postFormWithExtraArgs = postForm.bind(null, extraArgs)

  // Pass previous panel path to the Aanvullende vragen component
  const previousPanelPath = getPreviousPanelPath(classificationId, currentPanelIndex, data)

  return (
    <AdditionalQuestions
      action={postFormWithExtraArgs}
      formComponents={panelQuestions}
      previousPanelPath={previousPanelPath}
    />
  )
}
