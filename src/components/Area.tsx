import Query from '@/components/Area/Query'
import { FormEvent } from 'react'

export default function Area() {
  const onAdd = (e: FormEvent) => {
    e.preventDefault()
    console.log('add')
  }
  return <>
    <Query onAdd={onAdd} />
    {/* <List @lnglat="onReviewLnglat" @edit="onCellEdit" />
  <Edit v-model:visible="editVisible" v-model:lnglat="currentLnglat" :editData="editData" @confirm="onEditConfirm"
    @showmap="onShowMap" />
  <Map :visible="dialogMapVisible" :defaultLnglat="defaultLnglat" @choose="doChooseLnglat" @close="onCloseMap" /> */}
  </>
}