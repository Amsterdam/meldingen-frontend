'use client'

import { Heading, Paragraph, StandaloneLink } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import Image from 'next/image'
import NextLink from 'next/link'
import { useActionState, useEffect, useRef } from 'react'

import { Feature } from '@meldingen/api-client'
import { InvalidFormAlert, SubmitButton } from '@meldingen/ui'

import type { FormState } from 'apps/melding-form/src/types'

import { BackLink } from '../_components/BackLink/BackLink'
import { FormHeader } from '../_components/FormHeader/FormHeader'
import { SystemErrorAlert } from '../_components/SystemErrorAlert/SystemErrorAlert'
import { getDocumentTitleOnError } from '../_utils/getDocumentTitleOnError'
import { useSetFocusOnInvalidFormAlert } from '../_utils/useSetFocusOnInvalidFormAlert'
import { getContainerFeatureIconSVG } from '../../(map)/locatie/kies/_components/AssetList/getContainerFeatureIconSVG'
import { postLocationForm } from './actions'

import styles from './Location.module.css'

const initialState: Pick<FormState, 'systemError' | 'validationErrors'> = {}

type Props = {
  address?: string
  assetList?: any[]
  prevPage: string
}

const getAssetElement = (asset: Feature, idNummer: string) => {
  const icon = getContainerFeatureIconSVG(asset)
  const altText = `${asset.properties?.fractie_omschrijving ?? ''} icon`.trim()

  return (
    <span className={styles.label}>
      <Image alt={altText} height={32} src={icon} width={32} />
      <span>{idNummer}</span>
    </span>
  )
}

export const Location = ({ address, assetList, prevPage }: Props) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)

  const [{ systemError, validationErrors }, formAction] = useActionState(postLocationForm, initialState)

  const t = useTranslations('location')
  const tShared = useTranslations('shared')

  // Set focus on InvalidFormAlert when there are validation errors
  useSetFocusOnInvalidFormAlert(invalidFormAlertRef, validationErrors)

  // Update document title when there are validation errors
  const documentTitle = getDocumentTitleOnError(t('metadata.title'), tShared, validationErrors)

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

        <FormHeader step={t('step')} title={t('title')} />

        <Heading className="ams-mb-s" level={1} size="level-3">
          {t('question')}
        </Heading>
        <Paragraph className="ams-mb-s">{address ?? t('description')}</Paragraph>
        {assetList &&
          assetList.length > 0 &&
          assetList.map((asset) => {
            const idNummer = asset.external_id
            return (
              <div className="ams-mb-m" key={idNummer}>
                {getAssetElement(asset, idNummer)}
              </div>
            )
          })}
        <NextLink href="/locatie/kies" legacyBehavior passHref>
          <StandaloneLink className="ams-mb-m" id="location-link">
            {address ? t('link.with-location') : t('link.without-location')}
          </StandaloneLink>
        </NextLink>

        <Form action={formAction} noValidate>
          <SubmitButton>{t('submit-button')}</SubmitButton>
        </Form>
      </main>
    </>
  )
}
