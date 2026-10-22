import { AddNote } from './AddNote'

type Props = Pick<PageProps<'/melding/[meldingId]/notities/toevoegen'>, 'params'>

export default async ({ params }: Props) => {
  const { meldingId } = await params

  return <AddNote meldingId={Number(meldingId)} />
}
