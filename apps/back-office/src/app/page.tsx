import type { Metadata } from 'next'

import { Overview } from './overzicht/Overview'

export const metadata: Metadata = {
  title: 'Overzicht meldingen openbare ruimte - Gemeente Amsterdam',
}

export default async () => <Overview />
