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
    .replace('{west}', String(west))
    .replace('{south}', String(south))
    .replace('{east}', String(east))
    .replace('{north}', String(north))
    .replace('{srsName}', srsName)
}
