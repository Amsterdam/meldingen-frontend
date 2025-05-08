'use client'

import { Field, Grid, Heading, Label, Paragraph, Select } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { SubmitButton } from '@meldingen/ui'

import { postChangeStateForm } from './actions'
import { isValidMeldingState } from './utils'
import { BackLink } from '../_components/BackLink'

const initialState: { message?: string } = {}

export const ChangeState = ({ meldingId, meldingState }: { meldingId: number; meldingState: string }) => {
  const postChangeStateFormWithMeldingId = postChangeStateForm.bind(null, { meldingId })

  const [formState, formAction] = useActionState(postChangeStateFormWithMeldingId, initialState)

  const t = useTranslations('change-state')

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <BackLink className="ams-mb-s" href={`/melding/${meldingId}`}>
          {t('back-link')}
        </BackLink>
        <Heading className="ams-mb-l" level={1}>
          {t('title', { meldingId })}
        </Heading>
        {formState?.message && <Paragraph>{formState.message}</Paragraph>}
        <form action={formAction}>
          <Field className="ams-mb-l">
            <Label htmlFor="state">{t('label')}</Label>
            <Select defaultValue={isValidMeldingState(meldingState) ? meldingState : undefined} id="state" name="state">
              <Select.Option value="">{t('options.default')}</Select.Option>
              <Select.Option value="processing">{t('options.processing')}</Select.Option>
              <Select.Option value="completed">{t('options.completed')}</Select.Option>
            </Select>
          </Field>
          <SubmitButton>{t('submit-button')}</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
