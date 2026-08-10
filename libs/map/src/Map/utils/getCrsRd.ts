import type { CRS, LatLng } from 'leaflet'
import type { PointExpression } from 'leaflet'
import type { InterfaceCoordinates } from 'proj4'

import L from 'leaflet'
import proj4 from 'proj4'

export const CRS_CONFIG = {
  EARTH_RADIUS: 6378137,
  RD: {
    code: 'EPSG:28992',
    projection:
      '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +' +
      'y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.3507326' +
      '76542563,-1.8703473836068,4.0812 +no_defs',
    transformation: {
      bounds: {
        bottomRight: [595401.92, 22598.08] as PointExpression,
        topLeft: [-285401, 903401] as PointExpression,
      },
    },
  },
  WGS84: {
    code: 'EPSG:4326',
    projection: '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
  },
}

export const proj4RD = proj4(CRS_CONFIG.WGS84.code, CRS_CONFIG.RD.projection)

/**
 * Returns RD coordinates (RD = "Rijksdriehoekscoordinaten") in the
 * geodetic coordinate system used nationally in the European Netherlands
 * for geographical indications and files.
 * CRS means coordinate reference system, describing coordinate meaning.
 *
 * @param maxZoom
 * @param zeroScale
 * @param scales
 */
const getCrsRd = (maxZoom = 16, zeroScale = 3440.64, scales: number[] = []): CRS => {
  for (let i = 0; i <= maxZoom; i++) {
    scales.push(1 / (zeroScale * 0.5 ** i))
  }

  return {
    ...L.CRS.Simple,
    ...{
      code: CRS_CONFIG.RD.code,
      distance: L.CRS.Earth.distance,
      infinite: false,
      projection: {
        bounds: L.bounds(CRS_CONFIG.RD.transformation.bounds.topLeft, CRS_CONFIG.RD.transformation.bounds.bottomRight),
        proj4def: CRS_CONFIG.RD.projection,
        project: (latlng: LatLng) => {
          const [x, y] = proj4RD.forward([latlng.lng, latlng.lat])
          return new L.Point(x, y)
        },

        unproject: (point: InterfaceCoordinates) => {
          const [lng, lat] = proj4RD.inverse([point.x, point.y])
          return L.latLng(lat, lng)
        },
      },

      R: CRS_CONFIG.EARTH_RADIUS,
      scale: (zoom: number) => {
        if (scales[zoom]) {
          return scales[zoom]
        }
        return 1 / (zeroScale * 0.5 ** zoom)
      },
      transformation: new L.Transformation(1, 285401.92, -1, 903401.92),

      zoom: (scale: number) => Math.log(1 / scale / zeroScale) / Math.log(0.5),
    },
  }
}

export default getCrsRd
