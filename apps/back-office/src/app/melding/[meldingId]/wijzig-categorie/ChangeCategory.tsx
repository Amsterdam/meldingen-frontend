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
import { useStateAction } from 'next-safe-action/hooks'
import Form from 'next/form'
import { useEffect, useState } from 'react'

import type { ClassificationOutput, SimpleClassificationOutput } from '@meldingen/api-client'

import { getAriaDescribedBy } from '@meldingen/form-renderer'

import { BackLink } from '../_components/BackLink'
import { CancelLink } from '../_components/CancelLink'
import { postChangeCategoryForm } from './actions'
import { ERRORS, REASON_COUNT_MAX_LENGTH } from './constants'
import { ApiErrorAlert } from '~/app/_components'
import { useDocumentTitleOnError } from '~/app/_utils/useDocumentTitleOnError'

import styles from './ChangeCategory.module.css'

export type Props = {
  classifications: ClassificationOutput[]
  meldingClassification: SimpleClassificationOutput | null | undefined
  meldingId: number
  publicId: string
}

export const ChangeCategory = ({ classifications, meldingClassification, meldingId, publicId }: Props) => {
  const [characterCount, setCharacterCount] = useState(0)
  const {
    formAction,
    input,
    isPending,
    result: { serverError, validationErrors },
  } = useStateAction(postChangeCategoryForm.bind(null, meldingId, meldingClassification?.id))
  const reasonErrorMessage = validationErrors?.reason?._errors?.[0]
  const categoryErrorMessage = validationErrors?.category?._errors?.[0]

  const t = useTranslations('change-category')

  // Update document title when there is an API error
  const documentTitle = useDocumentTitleOnError({
    apiErrorMessage: serverError ? t(ERRORS.SERVER.CHANGE_FAILED) : undefined,
    baseDocumentTitle: t('metadata.title'),
    hasApiError: Boolean(serverError),
  })

  useEffect(() => {
    if (serverError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(serverError)
    }
  }, [serverError])

  const selectedCategory = input?.category ?? (meldingClassification?.id ? String(meldingClassification.id) : '')

  return (
    <div className="ams-page__area--body">
      <title>{documentTitle}</title>
      <BackLink href={`/melding/${meldingId}`}>{t('back-link')}</BackLink>
      <Grid as="main" gapVertical="large">
        <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
          {Boolean(serverError) && <ApiErrorAlert heading={t(ERRORS.SERVER.CHANGE_FAILED)} shouldFocus={!isPending} />}
          <Heading className="ams-mb-m" level={1}>
            {t('title', { publicId })}
          </Heading>
          <Form
            action={(formData) =>
              formAction({
                category: String(formData.get('category') ?? ''),
                reason: String(formData.get('reason') ?? ''),
              })
            }
            className={clsx(styles.formPanel)}
            noValidate
          >
            <Field className="ams-mb-m" invalid={Boolean(validationErrors?.category?._errors?.length)}>
              <Label htmlFor="category">{t('form-labels.category')}</Label>
              {categoryErrorMessage && <ErrorMessage id="category-error">{t(categoryErrorMessage)}</ErrorMessage>}
              <Select
                aria-describedby={getAriaDescribedBy('category', undefined, categoryErrorMessage)}
                aria-required="true"
                className={styles.selectFullWidth}
                defaultValue={selectedCategory}
                id="category"
                invalid={Boolean(validationErrors?.category?._errors?.length)}
                key={selectedCategory}
                name="category"
              >
                {!meldingClassification?.id && <Select.Option value="">-- Kies categorie --</Select.Option>}
                {classifications.map((classification) => (
                  <Select.Option key={classification.id} value={classification.id}>
                    {classification.name}
                  </Select.Option>
                ))}
              </Select>
            </Field>
            <Field className="ams-mb-m" invalid={Boolean(validationErrors?.reason?._errors?.length)}>
              <Label htmlFor="reason">{t('form-labels.reason')}</Label>
              <Paragraph id="reason-description">{t('form-labels.reason-description')}</Paragraph>
              {reasonErrorMessage && (
                <ErrorMessage id="reason-error">{t(reasonErrorMessage, { max: REASON_COUNT_MAX_LENGTH })}</ErrorMessage>
              )}
              <TextArea
                aria-describedby={getAriaDescribedBy(
                  'reason',
                  t('form-labels.reason-description'),
                  validationErrors?.reason?._errors?.[0],
                )}
                aria-required
                defaultValue={input?.reason ?? ''}
                id="reason"
                invalid={Boolean(validationErrors?.reason?._errors?.length)}
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
