import { useTranslations } from 'next-intl'
import { Fragment } from 'react'

import { DescriptionList, UnorderedList } from '@meldingen/ui'

import type { MeldingWithAddress } from '../Overview'

import { OVERVIEW_FIELDS } from '../constants'
import { getOverviewFieldLabel, renderOverviewFieldValue } from './_utils'

import styles from './OverviewMobile.module.css'

type Props = {
  meldingen: MeldingWithAddress[]
}

export const OverviewMobile = ({ meldingen }: Props) => {
  const t = useTranslations()

  return (
    <UnorderedList className={styles.list} markers={false}>
      {meldingen.map((melding) => (
        <UnorderedList.Item className={styles.card} key={melding.public_id}>
          <DescriptionList className={styles.descriptionList}>
            {OVERVIEW_FIELDS.map((field) => (
              <Fragment key={field.key}>
                <DescriptionList.Term>{getOverviewFieldLabel(field, t)}</DescriptionList.Term>
                <DescriptionList.Description>{renderOverviewFieldValue(melding, field, t)}</DescriptionList.Description>
              </Fragment>
            ))}
          </DescriptionList>
        </UnorderedList.Item>
      ))}
    </UnorderedList>
  )
}
