import { Map } from 'leaflet'

export const getWfsFilter = (filterTemplate: string, mapInstance: Map, srsName?: string) => {
  const north = mapInstance.getBounds().getNorth()
  const south = mapInstance.getBounds().getSouth()
  const east = mapInstance.getBounds().getEast()
  const west = mapInstance.getBounds().getWest()

  return filterTemplate
    .replaceAll('{west}', String(west))
    .replaceAll('{south}', String(south))
    .replaceAll('{east}', String(east))
    .replaceAll('{north}', String(north))
    .replaceAll('{srsName}', srsName ?? '')
}
