'use client'

import { Field, Grid, Heading, Label, Paragraph, Select } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState } from 'react'

import { MeldingOutput, StatesOutput } from '@meldingen/api-client'
import { SubmitButton } from '@meldingen/ui'

import { BackLink } from '../_components/BackLink'
import { postChangeStateForm } from './actions'
import { isValidMeldingState } from './utils'

type Props = {
  meldingId: number
  meldingState: MeldingOutput['state']
  possibleStates: StatesOutput['states']
  publicId: MeldingOutput['public_id']
}

const initialState: { errorMessage?: string } = {}

export const ChangeState = ({ meldingId, meldingState, possibleStates, publicId }: Props) => {
  const postChangeStateFormWithMeldingId = postChangeStateForm.bind(null, { meldingId })
  const [{ errorMessage }, formAction] = useActionState(postChangeStateFormWithMeldingId, initialState)

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
        {errorMessage && <Paragraph>{errorMessage}</Paragraph>}
        <Form action={formAction} noValidate>
          <Field className="ams-mb-l">
            <Label htmlFor="state">{t('change-state.label')}</Label>
            <Select defaultValue={isValidMeldingState(meldingState) ? meldingState : undefined} id="state" name="state">
              <Select.Option value={meldingState}>{t(`shared.state.${meldingState}`)}</Select.Option>
              {possibleStates.map((state) => (
                <Select.Option key={state} value={state}>
                  {t(`shared.state.${state}`)}
                </Select.Option>
              ))}
            </Select>
          </Field>
          <SubmitButton>{t('change-state.submit-button')}</SubmitButton>
        </Form>
      </Grid.Cell>
    </Grid>
  )
}
