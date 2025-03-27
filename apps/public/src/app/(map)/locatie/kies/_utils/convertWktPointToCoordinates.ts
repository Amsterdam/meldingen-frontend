type LatLngTuple = [number, number]

const convertCoordsToLatLng = (coordinates: LatLngTuple) => {
  const coordsWithoutAltitude = [coordinates[0], coordinates[1]]

  return coordsWithoutAltitude.sort((a, b) => (a > b ? 1 : -1)).reverse()
}

export const convertWktPointToCoordinates = (wktPoint: string) => {
  const pointMatch = wktPoint.match(/\d+\.\d+/gi)

  if (!wktPoint.includes('POINT') || !pointMatch || pointMatch?.length <= 1) return undefined

  const [lat, lng] = convertCoordsToLatLng(pointMatch.map((str) => Number.parseFloat(str)) as LatLngTuple)

  return {
    lat,
    lng,
  }
}
