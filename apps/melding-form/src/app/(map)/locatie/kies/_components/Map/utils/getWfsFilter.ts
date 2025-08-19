import L from 'leaflet'

export const getWfsFilter = (mapInstance: L.Map) => {
  const lowerCorner = mapInstance.getBounds().getSouthWest()
  const upperCorner = mapInstance.getBounds().getNorthEast()

  return `
    <Filter>
      <And>
        <PropertyIsEqualTo>
          <PropertyName>status</PropertyName>
          <Literal>1</Literal>
        </PropertyIsEqualTo>
      
        <BBOX>
          <gml:Envelope srsName="EPSG:4326">
              <gml:lowerCorner>${lowerCorner.lng} ${lowerCorner.lat}</gml:lowerCorner>
              <gml:upperCorner>${upperCorner.lng} ${upperCorner.lat}</gml:upperCorner>
          </gml:Envelope>
        </BBOX>
      </And>
    </Filter>
  `
}
