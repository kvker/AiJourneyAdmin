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
  let loadingHtml = `<span class="loading loading-bars loading-lg">${text}</span>`
  document.body.insertAdjacentHTML('beforeend', loadingHtml)
}

export const unloading = () => {
  document.querySelector('.loading')?.remove()
}