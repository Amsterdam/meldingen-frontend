import NextLink from 'next/link'

import { Link, Table } from '@meldingen/ui'

import type { MeldingWithAddress, OverviewField } from './overviewFields'

import { formatValue, getMeldingDetailHref, OVERVIEW_FIELDS } from './overviewFields'

type Props = {
  fields?: OverviewField[]
  meldingen: MeldingWithAddress[]
  t: (key: string, values?: Record<string, string | number | Date>) => string
}

const renderTableHeaders = (fields: OverviewField[], t: Props['t']) =>
  fields.map(({ key, labelKey }) => <Table.HeaderCell key={key}>{t(`overview.${labelKey}`)}</Table.HeaderCell>)

const renderTableRows = (meldingen: MeldingWithAddress[], fields: OverviewField[], t: Props['t']) =>
  meldingen.map((melding) => (
    <Table.Row key={melding.public_id}>
      {fields.map(({ key }) => {
        if (key === 'public_id') {
          return (
            <Table.Cell key={key}>
              <NextLink href={getMeldingDetailHref(melding)} legacyBehavior passHref>
                <Link>{melding.public_id}</Link>
              </NextLink>
            </Table.Cell>
          )
        }

        return <Table.Cell key={key}>{formatValue(melding, key, t)}</Table.Cell>
      })}
    </Table.Row>
  ))

export const OverviewDesktop = ({ fields = OVERVIEW_FIELDS, meldingen, t }: Props) => (
  <Table className="ams-mb-l">
    <Table.Header>
      <Table.Row>{renderTableHeaders(fields, t)}</Table.Row>
    </Table.Header>
    <Table.Body>{renderTableRows(meldingen, fields, t)}</Table.Body>
  </Table>
)
