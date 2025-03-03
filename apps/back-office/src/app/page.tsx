import type { Metadata } from 'next'

import { Overview } from './overzicht/Overview'

export const metadata: Metadata = {
  title: 'Overzicht | Meldingen',
}

export default async () => <Overview />
