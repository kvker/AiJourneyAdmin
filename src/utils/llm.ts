type GLMResponseJSON = { "id": string, "created": number, "model": string, "choices": { "index": number, "finish_reason"?: "stop", "delta": { "role": "assistant", "content": string } }[], "usage"?: { "prompt_tokens": number, "completion_tokens": number, "total_tokens": number } }

type LLMCB = (result: string) => void

export async function doCompletions(content: string, SseCB: LLMCB, doneCB: LLMCB) {
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

  const response = await fetch("https://aiguidelcengine.ilovecats.cn/api/chat/sse", {
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

function doParseStreamChunk(response: Response, SseCB: LLMCB, doneCB: LLMCB) {
  const reader = response.body!.getReader()
  let text = ''
  let chunk = ''
  let json: GLMResponseJSON
  let temp_text = '' // 临时存储一节无法parse的字符串, 追加到可以parse为止
  let result_text = ''
  reader.read().then(function process({ done, value }) {
    text = new TextDecoder('utf-8').decode(value)
    console.log(text) // 调试用, 有一些奇奇怪怪的问题
    let textList = text.split('\n\n')
    for (text of textList) {
      if (!text.trim()) continue
      try {
        text = (temp_text + text).replace(/data:\s|\[DONE\]/g, '')
        json = JSON.parse(text) as GLMResponseJSON
        temp_text = ''
        chunk = json.choices[0].delta.content
        if (chunk.trim()) {
          result_text += chunk
          // console.log(result_text)
          SseCB && SseCB(result_text)
        }
      } catch (error: any) {
        temp_text += text
      }
    }
    if (done) {
      console.log('done!!!')
      doneCB(result_text)
      return
    }
    reader.read().then(process)
  })
}