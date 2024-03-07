import { useState } from 'react'
import { auth } from '@/services/cloud'
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom'
import Total from '@/components/Total'

export default function LoginPage() {
  const navigate = useNavigate()
  if (!auth.currentUser) {
    alert('未登录, 非法进入')
    navigate('/', { replace: true })
  }
  const { pathname } = useLocation()
  console.log({ pathname })
  const basePath = '/home'
  const menu = [{
    path: '/total',
    name: '景区选择'
  }, {
    path: '/area',
    name: '景点管理'
  }, {
    //   path: '/toilet',
    //   name: '厕所管理'
    // }, {
    //   path: '/attention',
    //   name: '注意事项'
    // }, {
    //   path: '/user',
    //   name: '人员管理'
    // }, {
    path: '/setting',
    name: '设置'
  }]

  const [currentIndex, setCurrentIndex] = useState(doFindInitialIndex())
  function doFindInitialIndex() {
    let index = menu.findIndex(item => basePath + item.path === pathname)
    return index < 0 ? 0 : index
  }

  const onMenuSelect = (item: typeof menu[0], index: number) => {
    navigate(basePath + item.path)
    setCurrentIndex(index)
  }

  return <>
    <menu className=" h-full">
      <ul className="menu bg-base-200 w-56 rounded-box h-full">
        {
          menu.map((m, index) => {
            return <li key={index} onClick={() => onMenuSelect(m, index)} className={`cursor-pointer h-8 ${currentIndex === index ? 'active' : ''}`}>{m.name}</li>
          })
        }
      </ul>
    </menu >
    <main className=" flex-1 h-full p-2">
      <Routes>
        <Route path="/" element={<Total />} />
        <Route path="/total" element={<Total />} />
        {/* <Route path="/area" element={<Area />} />
        <Route path="/attention" element={<Attention />} />
        <Route path="/toilet" element={<Toilet />} />
        <Route path="/user" element={<User />} />
        <Route path="/setting" element={<Setting />} /> */}
      </Routes>
    </main>
    {/* <ChatBox /> */}
  </>
}