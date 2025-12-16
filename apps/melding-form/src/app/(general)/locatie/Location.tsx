'use client'

import { ErrorMessage, Field, Heading, Paragraph, StandaloneLink, UnorderedList } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import Image from 'next/image'
import NextLink from 'next/link'
import { useActionState, useEffect, useRef } from 'react'

import { Feature } from '@meldingen/api-client'
import { InvalidFormAlert, SubmitButton } from '@meldingen/ui'

import type { ValidationError } from 'apps/melding-form/src/types'

import { BackLink } from '../_components/BackLink/BackLink'
import { FormHeader } from '../_components/FormHeader/FormHeader'
import { SystemErrorAlert } from '../_components/SystemErrorAlert/SystemErrorAlert'
import { getDocumentTitleOnError } from '../_utils/getDocumentTitleOnError'
import { useSetFocusOnInvalidFormAlert } from '../_utils/useSetFocusOnInvalidFormAlert'
import { getContainerAssetIconSVG } from '../../(map)/locatie/kies/_components/AssetList/getContainerAssetIconSVG'
import { postLocationForm } from './actions'

import styles from './Location.module.css'

const initialState: { systemError?: unknown; validationError?: ValidationError } = {}

type Props = {
  address?: string
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

export const Location = ({ address, prevPage, selectedAssets }: Props) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)

  const [{ systemError, validationError }, formAction] = useActionState(postLocationForm, initialState)

  const t = useTranslations('location')
  const tShared = useTranslations('shared')

  // Set focus on InvalidFormAlert when there are validation errors
  useSetFocusOnInvalidFormAlert(invalidFormAlertRef, validationError && [validationError])

  // Update document title when there are validation errors
  const documentTitle = getDocumentTitleOnError(t('metadata.title'), tShared, validationError && [validationError])

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
      <BackLink className="ams-mb-s" href={prevPage}>
        {t('back-link')}
      </BackLink>
      <main>
        {Boolean(systemError) && <SystemErrorAlert />}
        {validationError && (
          <InvalidFormAlert
            className="ams-mb-m"
            errors={[{ id: `#${validationError.key}`, label: validationError.message }]}
            heading={tShared('invalid-form-alert-title')}
            headingLevel={2}
            ref={invalidFormAlertRef}
          />
        )}

        <FormHeader step={t('step')} title={t('title')} />

        <Field className={clsx(styles.location, 'ams-mb-m')} invalid={Boolean(validationError)} key={'id'}>
          <Heading className="ams-mb-s" level={1} size="level-3">
            {t('question')}
          </Heading>
          <Paragraph className="ams-mb-s">{address ?? t('description')}</Paragraph>
          {selectedAssets.length > 0 && (
            <UnorderedList className="ams-mb-m" markers={false}>
              {selectedAssets.map((asset) => getAssetElement(asset))}
            </UnorderedList>
          )}

          {validationError && (
            <ErrorMessage id={`${validationError.key}-error`}>{validationError.message}</ErrorMessage>
          )}
          <NextLink href="/locatie/kies" legacyBehavior passHref>
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
