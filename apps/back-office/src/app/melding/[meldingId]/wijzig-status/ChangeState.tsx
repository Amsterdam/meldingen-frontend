'use client'

import { Field, Grid, Heading, Label, Paragraph, Select } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { SubmitButton } from '@meldingen/ui'

import { postChangeStateForm } from './actions'
import { isValidMeldingState } from './utils'
import { BackLink } from '../_components/BackLink'

type Props = {
  meldingId: number
  meldingState: string
  publicId: string
}

const initialState: { message?: string } = {}

export const ChangeState = ({ meldingId, meldingState, publicId }: Props) => {
  const postChangeStateFormWithMeldingId = postChangeStateForm.bind(null, { meldingId })
  const [formState, formAction] = useActionState(postChangeStateFormWithMeldingId, initialState)

  const t = useTranslations()

  return (
    <Grid paddingBottom="2x-large" paddingTop="x-large">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <BackLink className="ams-mb-s" href={`/melding/${meldingId}`}>
          {t('change-state.back-link')}
        </BackLink>
        <Heading className="ams-mb-l" level={1}>
          {t('change-state.title', { publicId })}
        </Heading>
        {formState?.message && <Paragraph>{formState.message}</Paragraph>}
        <form action={formAction}>
          <Field className="ams-mb-l">
            <Label htmlFor="state">{t('change-state.label')}</Label>
            <Select defaultValue={isValidMeldingState(meldingState) ? meldingState : undefined} id="state" name="state">
              <Select.Option value="hoi">{t('change-state.options.default')}</Select.Option>
              <Select.Option value="processing">{t('generic.melding-state.processing')}</Select.Option>
              <Select.Option value="completed">{t('generic.melding-state.completed')}</Select.Option>
            </Select>
          </Field>
          <SubmitButton>{t('change-state.submit-button')}</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
