import type { Metadata } from 'next'

import { KiesLocatie } from './KiesLocatie'

export const metadata: Metadata = {
  title: 'Stap 1 van 4 - Beschrijf uw melding - Gemeente Amsterdam',
}

export default async () => <KiesLocatie />
