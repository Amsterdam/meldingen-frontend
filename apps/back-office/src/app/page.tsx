import type { Metadata } from 'next'

import { getMelding } from '../apiClientProxy'
import { Overview } from './Overview'

export const metadata: Metadata = {
  title: 'Overzicht meldingen openbare ruimte - Gemeente Amsterdam',
}

export default async () => {
  const { data } = await getMelding()

  return <Overview data={data} />
}
