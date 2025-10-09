'use client'

import { Heading, Paragraph, StandaloneLink } from '@amsterdam/design-system-react'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect, useRef, useTransition } from 'react'

import { InvalidFormAlert, SubmitButton } from '@meldingen/ui'

import { postLocationForm } from './actions'
import { BackLink } from '../_components/BackLink/BackLink'
import { FormHeader } from '../_components/FormHeader/FormHeader'
import { SystemErrorAlert } from '../_components/SystemErrorAlert/SystemErrorAlert'
import { getDocumentTitleOnError } from '../_utils/getDocumentTitleOnError'
import { useSetFocusOnInvalidFormAlert } from '../_utils/useSetFocusOnInvalidFormAlert'
import type { Coordinates, FormState } from 'apps/melding-form/src/types'

const initialState: Pick<FormState, 'systemError' | 'validationErrors'> = {}

export type LocationData = {
  address: string
  coordinates: Coordinates | null
}

type Props = {
  prevPage: string
  address?: string
}

export const Location = ({ address, prevPage }: Props) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)

  const [isPending, startTransition] = useTransition()

  const [{ systemError, validationErrors }, formAction] = useActionState(postLocationForm, initialState)

  const t = useTranslations('location')
  const tShared = useTranslations('shared')

  const handleOnClick = () => {
    startTransition(() => {
      formAction()
    })
  }

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

        <FormHeader title={t('title')} step={t('step')} />

        <Heading className="ams-mb-s" level={1} size="level-4">
          {t('question')}
        </Heading>
        <Paragraph className="ams-mb-s">{address ?? t('description')}</Paragraph>
        <NextLink href="/locatie/kies" legacyBehavior passHref>
          <StandaloneLink className="ams-mb-m" id="location-link">
            {address ? t('link.with-location') : t('link.without-location')}
          </StandaloneLink>
        </NextLink>

        <SubmitButton onClick={handleOnClick} disabled={isPending}>
          {t('submit-button')}
        </SubmitButton>
      </main>
    </>
  )
}
