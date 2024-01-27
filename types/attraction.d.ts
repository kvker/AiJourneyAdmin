declare const T: any
type LL = {
  longitude: number
  latitude: number
}
type Lnglat = {
  lng: number
  lat: number
}

type Attraction = {
  name: string
  introduce: string
  hello: string
  introduceImageList: url[]
  ipList: url[]
  introduceVideo: string
}

type Area = {
  objectId: string
  attraction?: AV.Object
  coverImageList: url[]
  description: string
  lnglat: Lnglat | null
  name: string
}

type AreaSearchParams = {
  name: string
}

type ChatStyle = {
  name: string
  description: string
  sort: number
} & LCBase