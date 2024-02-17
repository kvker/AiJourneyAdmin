const dialog = document.createElement('dialog')
dialog.id = 'serviceDialog'
dialog.style.cssText = 'fixed flex aic jcc w-100 h-100'
document.body.append(dialog)

export const toast = (text: string, type: 'success' | 'info' = 'success') => {
  const clean = () => {
    document.querySelectorAll('.toast').forEach(item => {
      item.remove()
    })
  }
  clean()
  let toastHtml = `<div class="toast toast-top toast-end">
  <div class="alert alert-${type}">
    <span>${text}</span>
  </div>
</div>`
  document.body.insertAdjacentHTML('beforeend', toastHtml)
  setTimeout(() => {
    clean()
  }, 1500)
}

export const loading = (text = '加载中') => {
  let loadingHtml = `<span class="loading loading-dots loading-lg">${text}</span>`
  dialog.insertAdjacentHTML('beforeend', loadingHtml)
  dialog.showModal()
}

export const unloading = () => {
  return new Promise<boolean>(s => {
    dialog.querySelector('.loading')?.remove()
    dialog.close()
    s(true)
  })
}