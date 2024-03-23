import { faasChatUrl } from '@/services/config'

type GlmResponseJson = { "id": string, "created": number, "model": string, "choices": { "index": number, "finish_reason"?: "stop", "delta": { "role": "assistant", "content": string } }[], "usage"?: { "prompt_tokens": number, "completion_tokens": number, "total_tokens": number } }

type LlmCb = (result: string) => void
// JSON.parse(localStorage.getItem('attraction') as Attraction
export default class LLM {
  controller: AbortController | undefined
  knowledgeId: string

  constructor() {
    const attraction: Attraction = JSON.parse(localStorage.getItem('attraction') as string)
    this.knowledgeId = attraction.knowledgeId as string
  }

  async onCompletions(content: string | GLMMessage[], SseCB: LlmCb, doneCb?: LlmCb) {
    let messages = []
    if (content instanceof Array) {
      messages = content
    } else {
      messages = [{ content, role: 'user' }] as GLMMessage[]
    }
    const response = await this.onFetchStream(messages)
    if (response.status !== 200) {
      return response.json().then((json: Object) => Promise.reject(json))
    }
    this.onParseStreamChunk(response, SseCB, doneCb)
  }

  async onFetchStream(messages: GLMMessage[]) {
    const body: { messages: GLMMessage[], tools?: GlmTools[] } = {
      messages: [{ role: 'system', content: '你是长河老街的专属AI智能导游，名字叫来来。是对这里最最熟悉的人，很愿意回答关于长河老街的问题。' }, ...messages],
    }
    if (this.knowledgeId) {
      body.tools = [{
        type: "retrieval",
        retrieval: {
          knowledge_id: this.knowledgeId,
        }
      }]
    }
    const raw = JSON.stringify(body)

    this.controller = new AbortController()
    const signal = this.controller.signal
    return await fetch(faasChatUrl + "/api/sse", {
      signal,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: 'text/event-stream',
        "Connection": "keep-alive",
      },
      body: raw,
    })
  }

  onAbortFetch() {
    if (this.controller) {
      console.log('abort fetch')
      this.controller.abort()
    }
  }

  /**
   * 对 GLM 返回的 Stream 且是 JSON 的字符串处理
   * @param text 待处理的字符
   * @param tempText 上次未能 parse 的尾部字符
   * @returns {jsonList, tempText} 其中的 tempText 是未能parse的字符串, 需要追加到下一次parse
   */
  onParseGlmStreamChunkJsons2JsonList(text: string, tempText: string): { jsonList: GlmResponseJson[], tempText: string } {
    // console.log(text)
    let json: GlmResponseJson
    let jsonList: GlmResponseJson[] = []
    let textList = text.split('\n\n')
    for (text of textList) {
      if (!text.trim()) continue
      text = (tempText + text).replace(/data:\s|\[DONE\]/g, '')
      try {
        // console.log(text.length)
        json = JSON.parse(text) as GlmResponseJson
        jsonList.push(json)
        tempText = ''
      } catch (error) {
        tempText += text
        // console.log(text)
        // console.error(error)
      }
    }
    return { jsonList, tempText }
  }

  async onParseStreamChunk(response: Response, sseCB: LlmCb, doneCb?: LlmCb) {
    const reader = response.body!.getReader()
    const decoder = new TextDecoder('utf-8')
    let value: Uint8Array | undefined
    let done = false
    let parseRet: { jsonList: GlmResponseJson[], tempText: string }
    let text = ''
    let content = ''
    let resultText = ''
    let tempText = '' // 临时存储一节无法parse的字符串, 追加到可以parse为止
    let readerRet: ReadableStreamReadResult<Uint8Array>
    while (true) {
      readerRet = await reader.read()
      value = readerRet.value
      done = readerRet.done
      // console.log(value)
      if (value) {
        text = decoder.decode(value)
        parseRet = this.onParseGlmStreamChunkJsons2JsonList(text, tempText)
        tempText = parseRet.tempText
        for (const json of parseRet.jsonList) {
          content = json.choices[0].delta.content
          if (content.trim()) {
            resultText += content
            // console.log(resultText)
            sseCB && sseCB(resultText)
          }
          // 使用await 延迟10ms
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      }
      if (done) {
        console.log('done!!!')
        doneCb && doneCb(resultText)
        break
      }
    }
  }
}