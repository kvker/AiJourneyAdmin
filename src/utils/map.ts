export function ll2Lnglat(ll: LL) {
  return {
    lng: ll.longitude,
    lat: ll.latitude,
  }
}

export function lnglat2Ll(lnglat: Lnglat) {
  return {
    longitude: lnglat.lng,
    latitude: lnglat.lat,
  }
}