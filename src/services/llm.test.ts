import { describe, expect, it } from 'vitest'
import { onCompletions } from './llm'

describe('测试LLM的SSE接口onCompletions', () => {
  it('传入 doneCB, 最终会执行 doneCB, 且正常返回 result', async () => {
    await onCompletions('你好啊', (chunk) => {
      // console.log(chunk)
    }, result => {
      // console.log(result)
      expect(typeof result).toEqual('string')
    })
  })
})

