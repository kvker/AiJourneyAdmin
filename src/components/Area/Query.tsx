import { FormEvent, useState } from "react"

export default function Query(props: { onAdd: (e: FormEvent) => void }) {
  const { onAdd } = props
  const [searchName, setSearchName] = useState('')

  return <>
    <form className="demo-form-inline" onSubmit={onAdd}>
      <label>
        <input id="searchName" value={searchName} placeholder="输入自动搜索" onChange={(e) => setSearchName(e.target.value)}
          className="input input-bordered w-full max-w-xs" />
      </label>
      <label className=" ml-2">
        <button className="btn btn-primary" type="submit">新增</button>
      </label>
    </form>
  </>
}