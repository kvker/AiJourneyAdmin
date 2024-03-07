import { auth } from '@/services/cloud'

export default function Setting() {

  const onLogout = () => {
    auth.signOut()
      .then(() => {
        localStorage.removeItem('attraction')
        location.href = import.meta.env.BASE_URL
      })
  }
  return <>
    <button className="btn btn-secondary" onClick={onLogout}>退出</button >
  </>
}