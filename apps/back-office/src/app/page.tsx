import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { handleApiError } from '../handleApiError'
import { Overview } from './Overview'
import { getMelding } from 'apps/back-office/src/apiClientProxy'

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

export default async ({ searchParams }: Props) => {
  const pageString = (await searchParams).pagina
  const page = !pageString ? undefined : parseInt(pageString, 10)

  if (page !== undefined && isNaN(page)) {
    redirect('/')
  }

  const { data, error, response } = await getMelding({
    query: { limit: PAGE_SIZE, offset: page ? (page - 1) * PAGE_SIZE : 0, sort: SORT },
  })

  const meldingenCountString = response.headers.get('Content-Range')?.split('/')[1]

  if (error || !meldingenCountString) return handleApiError(error)

  const meldingenCount = parseInt(meldingenCountString, 10)

  const totalPages = Math.ceil(meldingenCount / PAGE_SIZE)

  if (page && page > totalPages) {
    redirect('/')
  }

  return <Overview meldingen={data} meldingenCount={meldingenCount} page={page} totalPages={totalPages} />
}
