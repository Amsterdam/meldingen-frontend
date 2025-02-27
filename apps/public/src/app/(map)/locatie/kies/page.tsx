import type { Metadata } from 'next'

import { SelectLocation } from './SelectLocation'

export const metadata: Metadata = {
  title: 'Stap 1 van 4 - Beschrijf uw melding - Gemeente Amsterdam',
}

export default async () => <SelectLocation />
