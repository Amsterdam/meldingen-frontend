'use client'

import { Button, Field, Grid, Heading, Label, Paragraph, Select } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
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
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }}>
          <Heading className="ams-mb-l" level={1}>
            {t('change-state.title', { publicId })}
          </Heading>
          {errorMessage && <Paragraph>{errorMessage}</Paragraph>}
          <Form action={formAction} noValidate>
            <Field className={clsx(styles.whiteField, 'ams-mb-l')}>
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
            <Button type="submit">{t('change-state.submit-button')}</Button>
          </Form>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
