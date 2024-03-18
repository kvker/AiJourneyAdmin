const TmKey = '7679c343623ec0339bd308138c672120' // 天地图的 key

export function lnglat2Ll(lnglat: { lng: number, lat: number }) {
  return {
    longitude: lnglat.lng,
    latitude: lnglat.lat,
  }
}

export async function getGeocoder(name: string): Promise<Lnglat | undefined> {
  const ret = await fetch(`http://api.tianditu.gov.cn/geocoder?ds={"keyWord":"${name}"}&tk=${TmKey}`)
  const json = await ret.json()
  const location = json.location
  // console.log({ location })
  if (location) {
    return {
      longitude: location.lon,
      latitude: location.lat,
    }
  }
}