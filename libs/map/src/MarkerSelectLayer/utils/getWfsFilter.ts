import { Map } from 'leaflet'

export type GetWfsFilterArgs = {
  filter: string
  mapInstance: Map
  srsName: string
}

export const getWfsFilter = ({ filter, mapInstance, srsName }: GetWfsFilterArgs) => {
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
