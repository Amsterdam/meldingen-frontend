import { Feature } from '@meldingen/api-client'

export const containerAssets: Feature[] = [
  {
    geometry: {
      coordinates: [4.9, 52.3],
      type: 'Point',
    },
    id: 'container.1',
    properties: {
      fractie_omschrijving: 'Restafval',
      id_nummer: 'Container-001',
      name: 'Test Feature',
    },
    type: 'Feature',
  },
  {
    geometry: {
      coordinates: [4.9, 52.4],
      type: 'Point',
    },
    id: 'container.2',
    properties: {
      fractie_omschrijving: 'Glas',
      id_nummer: 'Container-002',
      name: 'Test Feature',
    },
    type: 'Feature',
  },
]
