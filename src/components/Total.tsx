import { useMemo, useState, ChangeEvent, useEffect } from 'react'
import { db } from '@/services/cloud'

export default function Total() {
  const [attraction, setAttraction] = useState<Attraction>(JSON.parse(localStorage.getItem('attraction') as string))
  const [attractionList, setAttractionList] = useState<Attraction[]>([])
  useEffect(() => {
    const getAttractionList = async () => {
      const { data } = await db.collection('JAttraction').get()
      setAttractionList(data)
      if (!attraction) {
        setAttraction(data[0])
      }
      localStorage.setItem('attraction', JSON.stringify(attraction))
    }
    getAttractionList()
  }, [])

  const attractionName = useMemo<string>(() => attractionList.find((item) => item.name === attraction?.name)?.name || '', [attraction, attractionList])

  const onChangeAttraction = (e: ChangeEvent) => {
    const select = e.target as HTMLSelectElement
    const name = select.value
    const currentAttraction = attractionList.find((item) => item.name === name) as Attraction
    setAttraction(currentAttraction)
    localStorage.setItem('attraction', JSON.stringify(currentAttraction))
  }

  return <>
    <div className="w-full h-full">
      <select className="select select-info w-full max-w-xs" onChange={onChangeAttraction} title='选择景区' value={attractionName}>
        <option disabled>选择景区</option>
        {
          attractionList.map((attraction) => {
            return <option key={attraction._id} value={attraction.name}>{attraction.name}</option>
          })
        }
      </select >
      <p>
        当前景区：{attraction?.name}
      </p>
    </div >
  </>
}