import { serverUrl } from '@/utils/config'

type GLMResponseJSON = { "id": string, "created": number, "model": string, "choices": { "index": number, "finish_reason"?: "stop", "delta": { "role": "assistant", "content": string } }[], "usage"?: { "prompt_tokens": number, "completion_tokens": number, "total_tokens": number } }

type LLMCB = (result: string) => void

export async function doCompletions(content: string, SseCB: LLMCB, doneCB?: LLMCB) {
  const response = await doFetchStream(content)
  if (response.status !== 200) {
    return response.json().then((json: Object) => Promise.reject(json))
  }
  doParseStreamChunk(response, SseCB, doneCB)
}

async function doFetchStream(content: string) {
  const raw = JSON.stringify({
    messages: [
      {
        role: "user",
        content,
      }
    ]
  })

  const response = await fetch(serverUrl + "/api/chat/sse", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: 'text/event-stream',
      "Connection": "keep-alive",
    },
    body: raw,
  })
  return response
}

async function doParseStreamChunk(response: Response, sseCB: LLMCB, doneCB?: LLMCB) {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder('utf-8')
  let value: Uint8Array | undefined
  let done = false
  let text = ''
  let chunk = ''
  let result_text = ''
  let temp_text = '' // 临时存储一节无法parse的字符串, 追加到可以parse为止
  let json: GLMResponseJSON
  let readerRet: ReadableStreamReadResult<Uint8Array>
  while (true) {
    readerRet = await reader.read()
    value = readerRet.value
    done = readerRet.done
    // console.log(value)
    if (value) {
      text = decoder.decode(value)
      // console.log(text)
      let textList = text.split('\n\n')
      for (text of textList) {
        if (!text.trim()) continue
        text = (temp_text + text).replace(/data:\s|\[DONE\]/g, '')
        try {
          if (text.match(/^{.*}]}$/)) {
            json = JSON.parse(text) as GLMResponseJSON
            temp_text = ''
            chunk = json.choices[0].delta.content
            if (chunk.trim()) {
              result_text += chunk
              // console.log(result_text)
              sseCB && sseCB(result_text)
            }
          } else {
            temp_text += text
          }
        } catch (error) {
          console.log(text)
          console.error(error)
        }
      }
    }
    if (done) {
      console.log('done!!!')
      doneCB && doneCB(result_text)
      break
    }
  }
}