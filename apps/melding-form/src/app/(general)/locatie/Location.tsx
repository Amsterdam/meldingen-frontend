'use client'

import { ErrorMessage, Field, Heading, Paragraph, StandaloneLink, UnorderedList } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import NextLink from 'next/link'
import { useActionState, useEffect, useRef } from 'react'

import type { Feature } from '@meldingen/api-client'

import { InvalidFormAlert, SubmitButton } from '@meldingen/ui'

import type { AssetTypeIconConfig, FormState } from '~/types'

import { SystemErrorAlert } from '../_components'
import { getDocumentTitleOnError } from '../_utils/validation'
import { BackLink } from '../../_components'
import { postLocationForm } from './actions'
import { AssetIcon } from '~/app/_components/AssetIcon/AssetIcon'
import { TOP_ANCHOR_ID } from '~/constants'

import styles from './Location.module.css'

const initialState: Pick<FormState, 'systemError' | 'validationErrors'> = {}

type Props = {
  address?: string
  assetTypeIconConfig: AssetTypeIconConfig
  prevPage: string
  selectedAssets: Feature[]
}

const getAssetElement = (asset: Feature, assetTypeIconConfig: AssetTypeIconConfig) => {
  // TODO: use assetType instead of "container" when available
  const label = `${asset.properties?.fractie_omschrijving ?? ''} container - ${asset.properties?.id_nummer}`

  return (
    <UnorderedList.Item className={styles.label} key={asset.id}>
      <AssetIcon
        alt=""
        assetTypeIconConfig={assetTypeIconConfig}
        height={32}
        properties={asset.properties}
        width={32}
      />
      <Paragraph>{label}</Paragraph>
    </UnorderedList.Item>
  )
}

export const Location = ({ address, assetTypeIconConfig, prevPage, selectedAssets }: Props) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)
  const systemErrorAlertRef = useRef<HTMLDivElement>(null)

  const [{ systemError, validationErrors }, formAction] = useActionState(postLocationForm, initialState)

  const t = useTranslations('location')
  const tShared = useTranslations('shared')

  // Update document title when there are system or validation errors
  const documentTitle = getDocumentTitleOnError({
    hasSystemError: Boolean(systemError),
    originalDocTitle: `${t('question')} - ${tShared('organisation-name')}`,
    translateFunction: tShared,
    validationErrorCount: validationErrors?.length,
  })

  // Set focus on InvalidFormAlert when there are validation errors
  // and on SystemErrorAlert when there is a system error
  useEffect(() => {
    if (validationErrors && invalidFormAlertRef.current) {
      invalidFormAlertRef.current.focus()
    } else if (systemError && systemErrorAlertRef.current) {
      systemErrorAlertRef.current.focus()
    }
  }, [validationErrors, systemError])

  useEffect(() => {
    if (systemError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(systemError)
    }
  }, [systemError])

  return (
    <>
      <title>{documentTitle}</title>
      <BackLink className="ams-mb-m" href={prevPage}>
        {t('back-link')}
      </BackLink>
      <main>
        {Boolean(systemError) && <SystemErrorAlert ref={systemErrorAlertRef} />}
        {validationErrors && (
          <InvalidFormAlert
            className="ams-mb-m"
            errors={validationErrors.map((error) => ({
              id: `#${error.key}`,
              label: error.message,
            }))}
            heading={tShared('invalid-form-alert-title')}
            headingLevel={2}
            ref={invalidFormAlertRef}
          />
        )}

        <Field className="ams-mb-l" invalid={Boolean(validationErrors)}>
          <Heading level={1} size="level-3">
            {t('question')}
          </Heading>
          <Paragraph>{address ?? t('description')}</Paragraph>
          {selectedAssets.length > 0 && (
            <UnorderedList markers={false}>
              {selectedAssets.map((asset) => getAssetElement(asset, assetTypeIconConfig))}
            </UnorderedList>
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
