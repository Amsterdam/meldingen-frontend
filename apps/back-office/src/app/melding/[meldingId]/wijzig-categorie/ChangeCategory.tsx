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
import { postChangeCategoryForm } from './actions'
import { REASON_COUNT_MAX_LENGTH } from './constants'
import { ApiErrorAlert } from '~/app/_components'
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
    postChangeCategoryForm.bind(null, {
      currentClassificationId: meldingClassification?.id,
      meldingId,
    }),
    initialState,
  )

  const t = useTranslations('change-category')

  // Update document title when there is an API error
  const documentTitle = useDocumentTitleOnError({
    apiErrorMessage: apiError ? t('errors.category-change-failed-heading') : undefined,
    baseDocumentTitle: t('metadata.title'),
    hasApiError: Boolean(apiError),
  })

  useEffect(() => {
    if (apiError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(apiError)
    }
  }, [apiError])

  const categoryIdErrorMessage = validationErrors?.find((error) => error.key === 'category-id')?.message
  const reasonErrorMessage = validationErrors?.find((error) => error.key === 'reason')?.message

  return (
    <div className="ams-page__area--body">
      <title>{documentTitle}</title>
      <BackLink href={`/melding/${meldingId}`}>{t('back-link')}</BackLink>
      <Grid as="main" gapVertical="large">
        <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
          {Boolean(apiError) && (
            <ApiErrorAlert heading={t('errors.category-change-failed-heading')} shouldFocus={!isPending} />
          )}
          <Heading className="ams-mb-m" level={1}>
            {t('title', { publicId })}
          </Heading>
          <Form action={formAction} className={clsx(styles.formPanel)} noValidate>
            <Field className="ams-mb-m" invalid={Boolean(categoryIdErrorMessage)}>
              <Label htmlFor="category-id">{t('form-labels.category')}</Label>
              {categoryIdErrorMessage && <ErrorMessage id="category-id-error">{categoryIdErrorMessage}</ErrorMessage>}
              <Select
                className={styles.selectFullWidth}
                defaultValue={meldingClassification?.id ? String(meldingClassification.id) : ''}
                id="category-id"
                invalid={Boolean(categoryIdErrorMessage)}
                key={meldingClassification?.id ?? 'no-classification'}
                name="category-id"
              >
                {!meldingClassification?.id && <Select.Option value={undefined}>-- Kies categorie --</Select.Option>}
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
                aria-describedby={getAriaDescribedBy(
                  'reason-description',
                  t('form-labels.reason-description'),
                  'reason-error',
                )}
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
