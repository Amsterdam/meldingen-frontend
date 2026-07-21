'use client'

import { ErrorMessage, Field, Heading, Paragraph, StandaloneLink, UnorderedList } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import Image from 'next/image'
import NextLink from 'next/link'
import { useActionState, useEffect } from 'react'

import type { Feature } from '@meldingen/api-client'

import { SubmitButton } from '@meldingen/ui'

import type { FormState } from '~/types'

import { getDocumentTitleOnError } from '../_utils/validation'
import { BackLink } from '../../_components'
import { getContainerAssetIconSVG } from '../../(map)/locatie/kies/_components/AssetList/getContainerAssetIconSVG'
import { ApiErrorAlert, InvalidFormAlert } from '~/app/_components'
import { TOP_ANCHOR_ID } from '~/constants'

import styles from './Location.module.css'

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

const getAssetElement = (asset: Feature) => {
  const icon = getContainerAssetIconSVG(asset)
  // TODO: use assetType instead of "container" when available
  const label = `${asset.properties?.fractie_omschrijving ?? ''} container - ${asset.properties?.id_nummer}`

  return (
    <UnorderedList.Item className={styles.label} key={asset.id}>
      <Image alt="" height={32} src={icon} width={32} />
      <Paragraph>{label}</Paragraph>
    </UnorderedList.Item>
  )
}

export const Location = ({ action, address, pageConfig, prevPage, selectedAssets }: Props) => {
  const [{ apiError, validationErrors }, formAction, isPending] = useActionState(action, initialState)

  const t = useTranslations('location')
  const tShared = useTranslations('shared')

  // Update document title when there are API or validation errors
  const documentTitle = getDocumentTitleOnError({
    hasSystemError: Boolean(apiError),
    originalDocTitle: `${pageConfig?.label ?? t('question')} - ${tShared('organisation-name')}`,
    translateFunction: tShared,
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
        {Boolean(apiError) && <ApiErrorAlert shouldRefocus={!isPending} />}
        {validationErrors && <InvalidFormAlert errors={validationErrors} shouldFocus={!isPending} />}
        <Field className="ams-mb-l" invalid={Boolean(validationErrors)}>
          <Heading level={1} size="level-3">
            {pageConfig?.label ?? t('question')}
          </Heading>
          <Paragraph>{address ?? pageConfig?.description ?? t('description')}</Paragraph>
          {selectedAssets.length > 0 && (
            <UnorderedList markers={false}>{selectedAssets.map((asset) => getAssetElement(asset))}</UnorderedList>
          )}
          {validationErrors &&
            validationErrors.map(({ key, message }) => <ErrorMessage key={key}>{message}</ErrorMessage>)}
          <NextLink href={`/locatie/kies#${TOP_ANCHOR_ID}`} legacyBehavior passHref>
            <StandaloneLink id="location-link">
              {address ? t('link.with-location') : t('link.without-location')}
            </StandaloneLink>
          </NextLink>
        </Field>
        <Form action={formAction} noValidate>
          <SubmitButton>{t('submit-button')}</SubmitButton>
        </Form>
      </main>
    </>
  )
}
