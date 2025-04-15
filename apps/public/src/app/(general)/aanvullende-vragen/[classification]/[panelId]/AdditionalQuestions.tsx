'use client'

import { Grid, Heading, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { FormRenderer } from '@meldingen/form-renderer'

import { BackLink } from '../../../_components/BackLink'

// TODO: fix types
type Props = {
  action: any
  formData: any[]
  previousPanelPath: string
}

const initialState: { message?: string } = {}

export const AdditionalQuestions = ({ action, formData, previousPanelPath }: Props) => {
  const [formState, formAction] = useActionState(action, initialState)

  const t = useTranslations('additional-questions')

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        {formState?.message && <Paragraph>{formState.message}</Paragraph>}
        <BackLink href={previousPanelPath} className="ams-mb-xs">
          {t('back-link')}
        </BackLink>
        <Heading level={1}>{t('step.title')}</Heading>
        <FormRenderer formData={formData} action={formAction} submitButtonText={t('submit-button')} />
      </Grid.Cell>
    </Grid>
  )
}
