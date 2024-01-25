import { describe, expect, it } from 'vitest'
import { ll2lnglat, lnglat2ll } from './map'

describe('ll2lnglat', () => {
  it('should convert latitude and longitude to lnglat format', () => {
    const lnglat = ll2lnglat({ longitude: -74.0060, latitude: 40.7128 })
    expect(lnglat).toEqual({ lng: -74.0060, lat: 40.7128 })
  })
})

describe('lnglat2ll', () => {
  it('should convert lnglat format to latitude and longitude', () => {
    const ll = lnglat2ll({ lng: -74.0060, lat: 40.7128 })
    expect(ll).toEqual({ longitude: -74.0060, latitude: 40.7128 })
  })
})


