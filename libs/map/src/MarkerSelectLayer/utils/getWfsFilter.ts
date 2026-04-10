import { Map } from 'leaflet'

export type GetWfsFilterQuery = {
  filter: string
  srsName: string
}

export const getWfsFilter = ({ filter, srsName }: GetWfsFilterQuery, mapInstance: Map) => {
  const bounds = mapInstance.getBounds()
  const north = bounds.getNorth()
  const south = bounds.getSouth()
  const east = bounds.getEast()
  const west = bounds.getWest()

  return filter
    .replaceAll('{west}', String(west))
    .replaceAll('{south}', String(south))
    .replaceAll('{east}', String(east))
    .replaceAll('{north}', String(north))
    .replaceAll('{srsName}', srsName)
}
