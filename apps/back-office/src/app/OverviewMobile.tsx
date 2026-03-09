import { useTranslations } from 'next-intl'
import NextLink from 'next/link'
import { Fragment } from 'react'

import { DescriptionList, Link } from '@meldingen/ui'

import type { MeldingWithAddress, OverviewField } from './overviewFields'

import { formatValue, getMeldingDetailHref, OVERVIEW_FIELDS } from './overviewFields'

type Props = {
  meldingen: MeldingWithAddress[]
}

const renderValue = (melding: MeldingWithAddress, field: OverviewField, t: (key: string) => string) => {
  if (field.key === 'public_id') {
    return (
      <NextLink href={getMeldingDetailHref(melding)} legacyBehavior passHref>
        <Link>{melding.public_id}</Link>
      </NextLink>
    )
  }

  return formatValue(melding, field.key, t) ?? ''
}

export const OverviewMobile = ({ meldingen }: Props) => {
  const t = useTranslations()

  return (
    <div>
      {meldingen.map((melding) => (
        <div key={melding.public_id}>
          <DescriptionList>
            {OVERVIEW_FIELDS.map((field) => (
              <Fragment key={field.key}>
                <DescriptionList.Term>{t(`overview.${field.labelKey}`)}</DescriptionList.Term>
                <DescriptionList.Description>{renderValue(melding, field, t)}</DescriptionList.Description>
              </Fragment>
            ))}
          </DescriptionList>
        </div>
      ))}
    </div>
  )
}
