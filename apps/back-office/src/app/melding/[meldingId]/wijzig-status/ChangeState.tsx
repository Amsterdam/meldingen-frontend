'use client'

import { Button, Field, Grid, Heading, Label, Paragraph, Select } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState } from 'react'

import { BackLink } from '../_components/BackLink'
import { postChangeStateForm } from './actions'
import { isValidMeldingState } from './utils'

import styles from './ChangeState.module.css'

type Props = {
  meldingId: number
  meldingState: string
  publicId: string
}

const initialState: { errorMessage?: string } = {}

export const ChangeState = ({ meldingId, meldingState, publicId }: Props) => {
  const postChangeStateFormWithMeldingId = postChangeStateForm.bind(null, { meldingId })
  const [{ errorMessage }, formAction] = useActionState(postChangeStateFormWithMeldingId, initialState)

  const t = useTranslations()

  return (
    <div className="ams-page__area--body">
      <Grid className="ams-mb-s">
        <Grid.Cell span="all">
          <BackLink href={`/melding/${meldingId}`}>{t('change-state.back-link')}</BackLink>
        </Grid.Cell>
      </Grid>

      <Grid as="main" gapVertical="large">
        <Grid.Cell span={{ narrow: 4, medium: 5, wide: 6 }}>
          <Heading level={1}>{t('change-state.title', { publicId })}</Heading>
          {errorMessage && <Paragraph>{errorMessage}</Paragraph>}
        </Grid.Cell>

        <Grid.Cell className={styles.whiteCell} span={{ narrow: 4, medium: 5, wide: 6 }}>
          <Form action={formAction} id="change-state-form" noValidate>
            <Field>
              <Label htmlFor="state">{t('change-state.label')}</Label>
              <Select
                defaultValue={isValidMeldingState(meldingState) ? meldingState : undefined}
                id="state"
                name="state"
              >
                <Select.Option value="">{t('change-state.options.default')}</Select.Option>
                <Select.Option value="processing">{t('shared.state.processing')}</Select.Option>
                <Select.Option value="completed">{t('shared.state.completed')}</Select.Option>
              </Select>
            </Field>
          </Form>
        </Grid.Cell>

        <Grid.Cell span="all">
          <Button form="change-state-form" type="submit">
            {t('change-state.submit-button')}
          </Button>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
