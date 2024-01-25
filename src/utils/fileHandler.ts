export function chooseFile(cb: (files?: FileList) => void, multiple = true, accept?: string) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = accept || 'image/*'
  input.multiple = multiple
  input.style.marginTop = '100000px'
  document.body.append(input)
  input.click()
  input.remove()

  input.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (files) {
      cb(files)
    } else {
      cb()
    }
  }
}