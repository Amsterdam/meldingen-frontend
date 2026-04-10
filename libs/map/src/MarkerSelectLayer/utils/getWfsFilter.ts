import { Map } from 'leaflet'

const DEFAULT_SRS_NAME = 'EPSG:4326'

export const getWfsFilter = (filterTemplate: string, mapInstance: Map, srsName: string = DEFAULT_SRS_NAME) => {
  const bounds = mapInstance.getBounds()
  const north = bounds.getNorth()
  const south = bounds.getSouth()
  const east = bounds.getEast()
  const west = bounds.getWest()

  return filterTemplate
    .replaceAll('{west}', String(west))
    .replaceAll('{south}', String(south))
    .replaceAll('{east}', String(east))
    .replaceAll('{north}', String(north))
    .replaceAll('{srsName}', srsName)
}
