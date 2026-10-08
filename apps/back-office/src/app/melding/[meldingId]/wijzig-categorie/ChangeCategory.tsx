'use client'

import {
  Button,
  CharacterCount,
  ErrorMessage,
  Field,
  Grid,
  Heading,
  Label,
  Paragraph,
  Row,
  TextArea,
} from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useState } from 'react'

import type { ClassificationOutput, SimpleClassificationOutput } from '@meldingen/api-client'

import { getAriaDescribedBy } from '@meldingen/form-renderer'
import { Column } from '@meldingen/ui'

import type { FormState } from '~/types'

import { BackLink } from '../_components/BackLink'
import { CancelLink } from '../_components/CancelLink'
import { postReclassificationForm } from './actions'
import { REASON_COUNT_MAX_LENGTH } from './constants'
import { ApiErrorAlert, ClassificationCombobox, InvalidFormAlert } from '~/app/_components'
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

  const classificationValue = (formData?.get('classificationQuery') as string | null) ?? meldingClassification?.name
  const classificationValidationErrorMessage = validationErrors?.find(
    (error) => error.key === 'classificationQuery',
  )?.message
  const reasonValidationErrorMessage = validationErrors?.find((error) => error.key === 'reason')?.message

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
          <Form action={formAction} className={styles.formPanel} noValidate>
            <Column>
              <ClassificationCombobox
                classifications={classifications}
                defaultValue={classificationValue}
                errorMessage={classificationValidationErrorMessage}
                label={t('form-labels.classification')}
                noResultsMessage={t('no-results')}
                placeholder={t('search-placeholder')}
              />
              <Field invalid={Boolean(reasonValidationErrorMessage)}>
                <Label htmlFor="reason">{t('form-labels.reason')}</Label>
                <Paragraph id="reason-description">{t('form-labels.reason-description')}</Paragraph>
                {reasonValidationErrorMessage && (
                  <ErrorMessage id="reason-error">{reasonValidationErrorMessage}</ErrorMessage>
                )}
                <TextArea
                  aria-describedby={getAriaDescribedBy(
                    'reason',
                    t('form-labels.reason-description'),
                    reasonValidationErrorMessage,
                  )}
                  aria-required
                  defaultValue={formData?.get('reason') as string}
                  id="reason"
                  invalid={Boolean(reasonValidationErrorMessage)}
                  name="reason"
                  onChange={(e) => setCharacterCount(e.target.value.length)}
                  rows={12}
                />
                <CharacterCount length={characterCount} maxLength={REASON_COUNT_MAX_LENGTH} />
              </Field>
              <Row alignVertical="center">
                <Button type="submit">{t('submit-button')}</Button>
                <CancelLink href={`/melding/${meldingId}`}>{t('cancel-link')}</CancelLink>
              </Row>
            </Column>
          </Form>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
