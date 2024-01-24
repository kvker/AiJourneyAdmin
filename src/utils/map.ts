export function ll2lnglat(ll: LL) {
  return {
    lng: ll.longitude,
    lat: ll.latitude,
  }
}

export function lnglat2ll(lnglat: Lnglat) {
  return {
    longitude: lnglat.lng,
    latitude: lnglat.lat,
  }
}