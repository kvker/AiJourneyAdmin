import { faasVoiceUrl } from '@/services/config'
import { app } from '@/services/cloud'

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

export function file2BlobUrl(file: File | url) {
  if (typeof file === 'string') return file
  return URL.createObjectURL(file)
}

export async function text2Voice(text: string, voiceType?: number): Promise<{ url: string }> {
  const ret = await fetch(faasVoiceUrl + '/api/text2voice', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, voiceType }),
  }).then(ret => ret.json())
  // console.log(ret.data.Audio)
  let audioBase64 = ret.data.base64
  function dataURLtoFile(base64: string, filename: string) {
    let mime = 'audio/mpeg',
      bstr = atob(base64),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }
  //调用
  const file = dataURLtoFile(audioBase64, Date.now() + '.mp3')
  const { download_url: url } = await uploadFile(file, "audios")
  return { url }
}

export async function uploadFile(file: File, rootPath: string) {
  return await app
    .uploadFile({
      // 云存储的路径
      cloudPath: rootPath + "/" + file.name,
      // 需要上传的文件，File 类型
      filePath: file,
    })
}