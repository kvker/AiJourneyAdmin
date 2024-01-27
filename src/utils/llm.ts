type GLMResponseJSON = { "id": string, "created": number, "model": string, "choices": { "index": number, "finish_reason"?: "stop", "delta": { "role": "assistant", "content": string } }[], "usage"?: { "prompt_tokens": number, "completion_tokens": number, "total_tokens": number } }

export function completions() {
  const raw = JSON.stringify({
    messages: [
      {
        role: "user",
        content: "作为一名营销专家，请为我的产品创作一个吸引人的slogan"
      }
    ]
  })

  fetch("https://aiguidelcengine.ilovecats.cn/api/chat/sse", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: 'text/event-stream',
      "Connection": "keep-alive",
    },
    body: raw,
  })
    .then(response => {
      if (response.status !== 200) {
        return response.json().then((json: Object) => Promise.reject(json))
      }
      const reader = response.body!.getReader()
      let text = ''
      let chunk = ''
      let json: GLMResponseJSON
      let temp_text = '' // 临时存储一节无法parse的字符串, 追加到可以parse为止
      let result_text = ''
      reader.read().then(function process({ done, value }) {
        if (done) {
          console.log('done!!!')
          return
        }
        text = new TextDecoder('utf-8').decode(value)
        text = text.replace(/data:\s|\[DONE\]/g, '')
        // console.log(text) // 调试用, 有一些奇奇怪怪的问题
        let textList = text.split('\n\n')
        for (text of textList) {
          if (!text.trim()) continue
          try {
            json = JSON.parse(temp_text + text) as GLMResponseJSON
            temp_text = ''
            chunk = json.choices[0].delta.content
            if (chunk.trim()) {
              result_text += chunk
              console.log(result_text)
            }
          } catch (error: any) {
            temp_text += text
          }
        }
        reader.read().then(process)
      })
    })
    .catch(alert)
}