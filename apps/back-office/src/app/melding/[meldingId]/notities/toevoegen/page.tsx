import { AddNote } from './AddNote'

type Params = {
  params: Promise<{ meldingId: number }>
}

export default async ({ params }: Params) => {
  const { meldingId } = await params

  return <AddNote meldingId={meldingId} />
}
