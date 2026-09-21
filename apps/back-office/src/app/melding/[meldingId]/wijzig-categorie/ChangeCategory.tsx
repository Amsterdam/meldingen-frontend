'use client'

import {
  ActionGroup,
  Button,
  CharacterCount,
  ErrorMessage,
  Field,
  Grid,
  Heading,
  Label,
  Paragraph,
  Select,
  TextArea,
} from '@amsterdam/design-system-react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useState } from 'react'

import type { ClassificationOutput, SimpleClassificationOutput } from '@meldingen/api-client'

import { getAriaDescribedBy } from '@meldingen/form-renderer'

import type { FormState } from '~/types'

import { BackLink } from '../_components/BackLink'
import { CancelLink } from '../_components/CancelLink'
import { postReclassificationForm } from './actions'
import { REASON_COUNT_MAX_LENGTH } from './constants'
import { ApiErrorAlert, InvalidFormAlert } from '~/app/_components'
import { useDocumentTitleOnError } from '~/app/_utils/useDocumentTitleOnError'

import styles from './ChangeCategory.module.css'

export type Props = {
  classifications: ClassificationOutput[]
  meldingClassification: SimpleClassificationOutput | null | undefined
  meldingId: number
  publicId: string
}

const initialState: FormState = {}

export const ChangeCategory = ({ classifications, meldingClassification, meldingId, publicId }: Props) => {
  const [characterCount, setCharacterCount] = useState(0)
  const [{ apiError, formData, validationErrors }, formAction, isPending] = useActionState(
    postReclassificationForm.bind(null, {
      currentClassificationId: meldingClassification?.id,
      meldingId,
    }),
    initialState,
  )

  const t = useTranslations('change-category')

  // Update document title when there is an API error
  const documentTitle = useDocumentTitleOnError({
    apiErrorMessage: apiError ? t('errors.reclassification-failed-heading') : undefined,
    baseDocumentTitle: t('metadata.title'),
    hasApiError: Boolean(apiError),
    validationErrorCount: validationErrors?.length ?? undefined,
  })

  useEffect(() => {
    if (apiError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(apiError)
    }
  }, [apiError])

  const classificationValue =
    (formData?.get('classification') as string | null) ??
    (meldingClassification?.id ? String(meldingClassification.id) : '')
  const classificationErrorMessage = validationErrors?.find((error) => error.key === 'classification')?.message
  const reasonErrorMessage = validationErrors?.find((error) => error.key === 'reason')?.message

  return (
    <div className="ams-page__area--body">
      <title>{documentTitle}</title>
      <BackLink href={`/melding/${meldingId}`}>{t('back-link')}</BackLink>
      <Grid as="main" gapVertical="large">
        <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
          {Boolean(apiError) && (
            <ApiErrorAlert
              description={t('errors.reclassification-failed-description')}
              heading={t('errors.reclassification-failed-heading')}
              shouldFocus={!isPending}
            />
          )}
          {validationErrors && <InvalidFormAlert errors={validationErrors} shouldFocus={!isPending} />}
          <Heading className="ams-mb-m" level={1}>
            {t('title', { publicId })}
          </Heading>
          <Form action={formAction} className={clsx(styles.formPanel)} noValidate>
            <Field className="ams-mb-m" invalid={Boolean(classificationErrorMessage)}>
              <Label htmlFor="classification">{t('form-labels.classification')}</Label>
              {classificationErrorMessage && (
                <ErrorMessage id="classification-error">{classificationErrorMessage}</ErrorMessage>
              )}
              <Select
                aria-describedby={getAriaDescribedBy('classification', undefined, classificationErrorMessage)}
                aria-required
                defaultValue={classificationValue}
                id="classification"
                invalid={Boolean(classificationErrorMessage)}
                key={classificationValue}
                name="classification"
              >
                {!meldingClassification?.id && <Select.Option value="">-- {t('option-placeholder')} --</Select.Option>}
                {classifications.map((classification) => (
                  <Select.Option key={classification.id} value={classification.id}>
                    {classification.name}
                  </Select.Option>
                ))}
              </Select>
            </Field>
            <Field className="ams-mb-m" invalid={Boolean(reasonErrorMessage)}>
              <Label htmlFor="reason">{t('form-labels.reason')}</Label>
              <Paragraph id="reason-description">{t('form-labels.reason-description')}</Paragraph>
              {reasonErrorMessage && <ErrorMessage id="reason-error">{reasonErrorMessage}</ErrorMessage>}
              <TextArea
                aria-describedby={getAriaDescribedBy('reason', t('form-labels.reason-description'), reasonErrorMessage)}
                aria-required
                defaultValue={formData?.get('reason') as string}
                id="reason"
                invalid={Boolean(reasonErrorMessage)}
                name="reason"
                onChange={(e) => setCharacterCount(e.target.value.length)}
                rows={12}
              />
              <CharacterCount length={characterCount} maxLength={REASON_COUNT_MAX_LENGTH} />
            </Field>
            <ActionGroup>
              <Button type="submit">{t('submit-button')}</Button>
              <CancelLink href={`/melding/${meldingId}`}>{t('cancel-link')}</CancelLink>
            </ActionGroup>
          </Form>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
