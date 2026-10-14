import { Fragment } from 'react'

import { DescriptionList, UnorderedList } from '@meldingen/ui'

import type { MeldingWithAddress } from '../Overview'

import { OVERVIEW_FIELDS } from '../constants'
import { getOverviewFieldLabel } from './_utils'
import { OverviewFieldValue } from './OverviewFieldValue'

import styles from './OverviewMobile.module.css'

type Props = {
  meldingen: MeldingWithAddress[]
}

export const OverviewMobile = ({ meldingen }: Props) => (
  <UnorderedList className={styles.list} markers={false}>
    {meldingen.map((melding) => (
      <UnorderedList.Item className={styles.card} key={melding.public_id}>
        <DescriptionList className={styles.descriptionList}>
          {OVERVIEW_FIELDS.map((field) => (
            <Fragment key={field.key}>
              <DescriptionList.Term>{getOverviewFieldLabel(field)}</DescriptionList.Term>
              <DescriptionList.Description>
                <OverviewFieldValue field={field} melding={melding} />
              </DescriptionList.Description>
            </Fragment>
          ))}
        </DescriptionList>
      </UnorderedList.Item>
    ))}
  </UnorderedList>
)
