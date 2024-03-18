import { describe, expect, it } from 'vitest'
import { lnglat2Ll } from './map'

describe('lnglat2Ll', () => {
  it('should convert lnglat format to latitude and longitude', () => {
    const ll = lnglat2Ll({ lng: -74.0060, lat: 40.7128 })
    expect(ll).toEqual({ longitude: -74.0060, latitude: 40.7128 })
  })
})


