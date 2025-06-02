import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { Overview } from './Overview'
import { handleApiError } from '../handleApiError'
import { getMelding, MeldingOutput } from 'apps/back-office/src/apiClientProxy'

export const generateMetadata = async () => {
  const t = await getTranslations('overview')

  return {
    title: t('metadata.title'),
  }
}

type Props = {
  searchParams: Promise<{ pagina?: string }>
}

const PAGE_SIZE = 10
const SORT = '["created_at","DESC"]'

type FormatNLAddressArgs = Pick<MeldingOutput, 'street' | 'house_number' | 'house_number_addition'>

const formatNLAddress = ({ street, house_number, house_number_addition }: FormatNLAddressArgs) => {
  if (!street || !house_number) {
    return null
  }

  return `${street} ${house_number}${house_number_addition ? `${house_number_addition}` : ''}`
}

export default async ({ searchParams }: Props) => {
  const pageString = (await searchParams).pagina
  const page = !pageString ? undefined : parseInt(pageString, 10)

  if (page !== undefined && isNaN(page)) {
    redirect('/')
  }

  const { data, error, response } = await getMelding({
    query: { limit: PAGE_SIZE, offset: page ? (page - 1) * PAGE_SIZE : 0, sort: SORT },
  })

  const meldingCountString = response.headers.get('Content-Range')?.split('/')[1]

  if (error || !data || !meldingCountString) return handleApiError(error)

  const meldingCount = parseInt(meldingCountString, 10)

  const totalPages = Math.ceil(meldingCount / PAGE_SIZE)

  if (page && page > totalPages) {
    redirect('/')
  }

  const dataWithAddresses = data.map((melding) => ({
    ...melding,
    address: formatNLAddress(melding),
  }))

  return <Overview data={dataWithAddresses} meldingCount={meldingCount} page={page} totalPages={totalPages} />
}
