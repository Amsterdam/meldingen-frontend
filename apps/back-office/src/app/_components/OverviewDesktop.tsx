import { Table } from '@meldingen/ui'

import type { MeldingWithAddress } from '../Overview'

import { OVERVIEW_FIELDS } from '../constants'
import { getOverviewFieldLabel } from './_utils'
import { OverviewFieldValue } from './OverviewFieldValue'

import styles from './OverviewDesktop.module.css'

const renderTableHeaders = () =>
  OVERVIEW_FIELDS.map((field) => <Table.HeaderCell key={field.key}>{getOverviewFieldLabel(field)}</Table.HeaderCell>)

const renderTableRows = (meldingen: MeldingWithAddress[]) =>
  meldingen.map((melding) => (
    <Table.Row key={melding.public_id}>
      {OVERVIEW_FIELDS.map((field) => (
        <Table.Cell key={field.key}>
          <OverviewFieldValue field={field} melding={melding} />
        </Table.Cell>
      ))}
    </Table.Row>
  ))

type Props = {
  meldingen: MeldingWithAddress[]
}

export const OverviewDesktop = ({ meldingen }: Props) => (
  <Table className={`ams-mb-l ${styles.desktopOnly} ${styles.table}`}>
    <Table.Header>
      <Table.Row>{renderTableHeaders()}</Table.Row>
    </Table.Header>
    <Table.Body>{renderTableRows(meldingen)}</Table.Body>
  </Table>
)
