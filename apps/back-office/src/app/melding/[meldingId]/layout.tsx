import type { Metadata } from 'next'

import { getMeldingTitle } from './_utils/getMeldingTitle'
import { DOCUMENT_TITLE_PLACEHOLDER } from './constants'

type Props = LayoutProps<'/melding/[meldingId]'>

export const generateMetadata = async ({ params }: Pick<Props, 'params'>): Promise<Metadata> => {
  const { meldingId } = await params
  const title = await getMeldingTitle(meldingId)

  return {
    title: {
      default: title,
      template: `${DOCUMENT_TITLE_PLACEHOLDER} - ${title}`,
    },
  }
}

export default async ({ children }: Props) => children
