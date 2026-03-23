import { redirect } from 'next/navigation'

const ALLOWED_STARTS = ['/locatie', '/aanvullende-vragen']

type SearchParams = Promise<{ start?: string }>

export default async ({ searchParams }: { searchParams: SearchParams }) => {
  const { start } = await searchParams

  if (!start || !ALLOWED_STARTS.some((path) => start.startsWith(path))) {
    redirect('/melden')
  }

  return (
    <iframe
      className="ams-page__area--body"
      src={start}
      style={{ border: 'none', display: 'block', height: '100%', width: '100%' }}
      title="Melding doorgeven"
    />
  )
}
