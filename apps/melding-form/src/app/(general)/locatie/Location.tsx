'use client'

import { ErrorMessage, Field, Heading, Paragraph, StandaloneLink, UnorderedList } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import NextLink from 'next/link'
import { useActionState, useEffect } from 'react'

import type { Feature } from '@meldingen/api-client'

import { SubmitButton } from '@meldingen/ui'

import type { FormState } from '~/types'

import { AssetElement } from '../_components/AssetElement/AssetElement'
import { useDocumentTitleOnError } from '../_utils/validation'
import { BackLink } from '../../_components'
import { ApiErrorAlert, InvalidFormAlert } from '~/app/_components'
import { TOP_ANCHOR_ID } from '~/constants'

const initialState: Pick<FormState, 'apiError' | 'validationErrors'> = {}

type Props = {
  action: (_: unknown, formData: FormData) => Promise<Pick<FormState, 'apiError' | 'validationErrors'>>
  address?: string
  pageConfig?: {
    description?: string
    label?: string
  }
  prevPage: string
  selectedAssets: Feature[]
}

export const Location = ({ action, address, pageConfig, prevPage, selectedAssets }: Props) => {
  const [{ apiError, validationErrors }, formAction, isPending] = useActionState(action, initialState)

  const t = useTranslations('location')
  const tShared = useTranslations('shared')

  // Update document title when there are API or validation errors
  const baseDocumentTitle = `${pageConfig?.label ?? t('question')} - ${tShared('organisation-name')}`
  const documentTitle = useDocumentTitleOnError({
    baseDocumentTitle,
    hasApiError: Boolean(apiError),
    validationErrorCount: validationErrors?.length,
  })

  useEffect(() => {
    if (apiError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(apiError)
    }
  }, [apiError])

  return (
    <>
      <title>{documentTitle}</title>
      <BackLink className="ams-mb-m" href={prevPage}>
        {t('back-link')}
      </BackLink>
      <main>
        {Boolean(apiError) && <ApiErrorAlert shouldFocus={!isPending} />}
        {validationErrors && <InvalidFormAlert errors={validationErrors} shouldFocus={!isPending} />}
        <Field className="ams-mb-l" invalid={Boolean(validationErrors)}>
          <Heading level={1} size="level-3">
            {pageConfig?.label ?? t('question')}
          </Heading>
          <Paragraph>{address ?? pageConfig?.description ?? t('description')}</Paragraph>
          {selectedAssets.length > 0 && (
            <UnorderedList markers={false}>
              {selectedAssets.map((asset) => (
                <UnorderedList.Item key={asset.id}>
                  <AssetElement asset={asset} />
                </UnorderedList.Item>
              ))}
            </UnorderedList>
          )}
          {validationErrors &&
            validationErrors.map(({ key, message }) => <ErrorMessage key={key}>{message}</ErrorMessage>)}
          <StandaloneLink href={`/locatie/kies#${TOP_ANCHOR_ID}`} id="location-link" linkComponent={NextLink}>
            {address ? t('link.with-location') : t('link.without-location')}
          </StandaloneLink>
        </Field>
        <Form action={formAction} noValidate>
          <SubmitButton>{t('submit-button')}</SubmitButton>
        </Form>
      </main>
    </>
  )
}
