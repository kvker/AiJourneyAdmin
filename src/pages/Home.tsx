import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = () => {
    console.log(111)
  }
  return <div className="w-full h-screen font-sans bg-cover bg-landscape"
    style={{ backgroundImage: 'url(https://www.tailwind-kit.com/images/landscape/2.jpg);' }}>
    <div className="container flex items-center justify-center flex-1 h-full mx-auto">
      <div className="w-full max-w-lg">
        <div className="leading-loose">
          <form className="max-w-sm p-10 m-auto rounded shadow-xl bg-white/25" id="formLogin" onSubmit={onSubmit}>
            <p className="mb-8 text-2xl font-light text-center text-white">AI导游大师后台管理-登录</p>
            <div className="mb-2">
              <div className="relative">
                <input value={email} type="text" id="login-with-bg-email"
                  className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="邮箱" />
              </div>
            </div>
            <div className="mb-2">
              <div className="relative">
                <input value={password} type="password" id="login-with-bg-password"
                  className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="密码" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button type="submit"
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                <span v-if="isLoading" className="loading loading-spinner"></span>
                登录
              </button>
            </div>
            <div className="text-center">
              <a
                className="right-0 inline-block text-sm font-light align-baseline text-500 hover:text-gray-800 cursor-pointer">忘记密码？</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div >
}