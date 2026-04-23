import { useTranslations } from 'next-intl'

import { Table } from '@meldingen/ui'

import type { MeldingWithAddress } from '../Overview'

import { getOverviewFieldLabel, OVERVIEW_FIELDS, renderOverviewFieldValue } from './utils/overviewFields'

import styles from './OverviewDesktop.module.css'

const renderTableHeaders = (t: (key: string) => string) =>
  OVERVIEW_FIELDS.map((field) => <Table.HeaderCell key={field.key}>{getOverviewFieldLabel(field, t)}</Table.HeaderCell>)

const renderTableRows = (meldingen: MeldingWithAddress[], t: (key: string) => string) =>
  meldingen.map((melding) => (
    <Table.Row key={melding.public_id}>
      {OVERVIEW_FIELDS.map((field) => (
        <Table.Cell key={field.key}>{renderOverviewFieldValue(melding, field, t)}</Table.Cell>
      ))}
    </Table.Row>
  ))

type Props = {
  meldingen: MeldingWithAddress[]
}

export const OverviewDesktop = ({ meldingen }: Props) => {
  const t = useTranslations()

  return (
    <Table className={`ams-mb-l ${styles.desktopOnly} ${styles.table}`}>
      <Table.Header>
        <Table.Row>{renderTableHeaders(t)}</Table.Row>
      </Table.Header>
      <Table.Body>{renderTableRows(meldingen, t)}</Table.Body>
    </Table>
  )
}
